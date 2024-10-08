import prisma from "../../db/db.config.js";
import z from 'zod'
import uploadOnCloudinary from "../utils/cloudinary.js";
import fs from 'fs'
import { error } from "console";
const roomSchema = z.object({
    title:z.string().min(3,"Name Should contains atleast 5 Characters"),
    desc:z.string().optional(),
    img:z.string().optional(),
    privacy:z.boolean()
})
export const CreateRoom = async (req,res)=>{
    const data = req.body;          //{title,desc,img,privacy}
    const userId = req.userId;
    data.privacy = (data.privacy == 'true')?true:false;
    const verifySchema = roomSchema.safeParse(data);

    if(!verifySchema.success){
        return res.status(400).json({
        msg:"Wrong Input",
                error:verifySchema.error
            });
    }
    let imgUrl = null;
    let rom;
    // console.log(`${req.file}`);
    try{
        if(req.file){ 
            try{
                imgUrl = await uploadOnCloudinary(req.file.path);
            }
            catch(err){
                return res.status(403).json({
                    msg:err.message
                })
            }
        }
        // console.log("Room Image URL "+imgUrl);
        rom =  await prisma.$transaction(async(tx)=>{
            // console.log("Inside Transactions");
            const newRoom = await tx.rooms.create({
                data:{
                    title:data.title,
                    desc:data.desc || "None",
                    img:imgUrl,
                    privateRoom:data.privacy,
                    CreatorId:userId
                }
            })
            if(newRoom.id && newRoom.CreatorId)
            {
                // console.log(newRoom.id+" "+newRoom.CreatorId);
                const RoomId = newRoom.id;
                const enrolled = await tx.enrolledRooms.create({
                    data:{
                        userId,
                        RoomId,
                        joined:true
                    }
                })
                console.log("created\n");
                
                return { newRoom, enrolled }; 
                
            }
            else{
                throw new Error("Server/Database Issue");
            }
        })
    }
    catch(err)
    {
        return res.status(500).json({
            msg:"Database/Server Error",
            error:err
        })
    }
    return res.status(201).json({
        msg:"Successfully Created",
        newRoom:rom.newRoom,
        enrolled:rom.enrolled
    })
}

export const updateRoom = async(req,res)=>{
    const data = req.body;
    const userId = req.userId;
    
    const title = data.title;

   
    try{
        // console.log("Inside UpdateRoom");
        const room = await prisma.rooms.findFirst({
            where:{
                title
            }
        })
        const temp = await prisma.rooms.findMany();
        // console.log(temp);
        // console.log(room);
        if(!room?.id)return res.status(404).json({msg:"Room Not Found!"});



        if(room.CreatorId != userId){
            return res.status(401).json({
                msg:"You don't have permission to perform changes in this room"
            })
        }
        let imgUrl = null,bgImgUrl = null;
        // console.log("data\n");
        console.log(req.file);
        if(req.file && req.file?.fieldname === 'roomImg')
        {
            
            try {
                imgUrl = await uploadOnCloudinary(req.file.path);
            } catch (error) {
                return res.status(400).json({
                    // fs.unlinkSync(req.file.path);    //Issue need to resolve
                    msg:error.message,
                    error
                })
            }
            
        }
        if(req.file && req.file?.fieldname === 'bgImg') 
        {
            try{
                // console.log("Uploading bgImg.......");
                bgImgUrl = await uploadOnCloudinary(req.file.path);
            } catch (error) {
                // console.log("Inside bgImg chatch");
                // fs.unlinkSync(req.file.path);    //Issue need to resolve
                console.log(error);
                return res.status(400).json({
                    msg: error.message,
                    error
                })
            }
        }    
        console.log(bgImgUrl);
        // console.log(`${JSON.stringify(req.file.path)} = ${bgImgUrl}`);
        const updatedRoom = await prisma.rooms.update({
            where:{
                id:room.id
            },
            data:{
                title: data.newTitle || room.title,
                desc: data.desc || room.desc,
                img: imgUrl || room.img,
                bgImg: bgImgUrl || room.bgImg
            }
        });

        res.status(200).json({
            msg:"Success",
            updatedRoom
        })
    }
    catch(err)
    {

        if(req.file?.path)fs.unlink(req.file.path,(err)=>
            console.log("Error While Deleting img = ",err)
        );
        console.log("error");
        console.log(err);
        return res.status(500).json({
            msg:"Database/Server Error",    
            error:err.message
        })
    }

    
}

export const deleteRoom =async(req,res)=>{
    const data = req.body;
    const userId = req.userId;

    try{
        const room = await prisma.rooms.findFirst({
            where:{
                id:data.id,
            }
        });
        if(!room)return res.status(401).json({msg:"Room Not Found"});

        if(room.CreatorId != userId) return res.status(401).json({msg:"You don't have permission to Perform this Action"});

        
        await prisma.$transaction(async(tx)=>{
            console.log("Inside Transactions");
            const deletedRoom = await tx.rooms.delete({
                where:{
                    id:room.id,
                },
            });
            console.log("deltedRoom");
            // const enrolled = await tx.enrolledRooms.deleteMany({
            //     where:{
            //         RoomId:room.id,
            //     },
            // });
            console.log("Entroldfja");
            return res.status(200).json({
                msg:"Success",
                deletedRoom
                // enrolled
            })
        })
    }
    catch(err)
    {
        return res.status(500).json({
            msg:"Database/Server Error",
            error:err
        })
    }
}

export const filterName = async(req,res)=>{
    const filter = req.query.filter;
    
    
    if(filter.length<3)return res.status(200).json({msg:false});
    try{
        const names = await prisma.rooms.findFirst({
            where:{
                title:filter
            }
        })
        if(names)return res.status(200).json({msg:false})
    
        return res.status(200).json({msg:true});
    }
    catch(err){
        return res.status(500).json({
            msg:"Server Issue",
            error:err
        })
    }
}


export const getBulk = async(req,res)=>{
    const filter = req.query.filter;
    if(!filter)return res.status(404).json({msg:"Not Found",names:[]});
    try{
        const names = await prisma.rooms.findMany({
            where:{
                title:{
                    startsWith:filter
                }
            },
            select:{
                id:true,
                title:true,
                CreatorId:true
            }
        })
        if(names)return res.status(200).json({msg:"Success",names})
    
        return res.status(404).json({msg:"Not Found",names:[]});
    }
    catch(err){
        return res.status(500).json({
            msg:"Server Issue",
            names:[],
            error:err
        })
    }
}

export const getRoom = async(req,res)=>{
    const title = req.params.title;

    if(!title)return res.status(404).json({msg:"Title Not Found",room:null});

    try {
        const room = await prisma.rooms.findFirst({
            where:{
                title
            },
            include:{
                UsersEnrolled:true,
                posts:true,
                _count:{
                    select:{
                        posts:true,
                    }
                }
            },
        })
        if(!room)return res.status(404).json({msg:"Not Found",room:null});

        return res.status(200).json({msg:"Found",room}); 
    } catch (error) {
        return res.status(500).json({
            msg:"Database/Server Issue",
            room:null,
            error
        })
    }
}

export const showRoom = async(req,res)=>{
    const title = req.params.title;
    const userID = req.userId;
    if(!title)return res.status(404).json({msg:"Title Not Found",room:null});

    try {
        const room = await prisma.rooms.findFirst({
            where:{
                title
            },
            include:{
                UsersEnrolled:true,
                _count:{
                    select:{
                        posts:true,
                        polls:true
                    }
                }
            }
        })
        console.log(userID);
        if(!room)return res.status(404).json({msg:"Not Found",room:null});
        let joins = false;
        room.UsersEnrolled.forEach((val)=>{
            console.log(val)
            if(val.userId === userID){joins = val.joined;}
        })
        return res.status(200).json({msg:"Found",room,joined:joins}); 
    } catch (error) {
        return res.status(500).json({
            msg:"Database/Server Issue",
            room:null,
            error
        })
    }
}

export const getAllRoom = async(req,res)=>{
    const id  = req.params.userID;
    if(!id) return res.status(404).json({msg:"Username not found",rooms:[]});
    try {
        const rooms = await prisma.enrolledRooms.findMany({
            where:{
                AND:[
                    {userId:id},
                    {joined:true}
                ]
            },
            select:{
                room:{
                    include:{
                        UsersEnrolled:true,
                        _count:{
                            select:{
                                posts:true,
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json({
            msg:"Success",
            rooms
        });
    } catch (error) {
        res.status(500).json({
            msg:"Database/Server Issue",
            error
        })
    }
}

export const getNotJoinedRoom = async(req,res)=>{
    const id  = req.userId;
    if(!id) return res.status(404).json({msg:"Username not found",rooms:[]});
    try {

        const rooms = await prisma.enrolledRooms.findMany({
            where:{
                AND:[
                    {userId:id},
                    {joined:true}
                ]
            },
            select:{
                room:{
                    include:{
                        UsersEnrolled:true,
                        _count:{
                            select:{
                                posts:true,
                            }
                        }
                    }
                }
            }
        })

        const roomIds = [];
        for (const roomObject of rooms) {
            // Extract the room ID and add it to the roomIds array
            roomIds.push(roomObject.room.id);
        }
        console.log(roomIds)
        const notJoinedRooms = await prisma.rooms.findMany({
            where:{
                AND:[
                    {
                        id:{
                            notIn:roomIds
                        },
                    },
                    {
                        privateRoom:false
                    }
                ]
            },
            include:{
                UsersEnrolled:true,
                _count:{
                    select:{
                        posts:true
                    }
                }
            }
        })
        res.status(200).json({
            msg:"Success",
            rooms:notJoinedRooms
        });
    } catch (error) {
        res.status(500).json({
            msg:"Database/Server Issue",
            error
        })
    }
}


export const addUser = async(req,res)=>{
    const userId = req.userId;
    const { title,Username } = req.body;
    try{
        const room = await prisma.rooms.findFirst({
            where:{
                title:title
            },
            select:{
                id:true,
                UsersEnrolled:true,
                privateRoom:true,
                title:true,
                img:true,
                bgImg:true,
                desc:true,
                CreatorId:true,
                createdAt:true,
                _count:{
                    select:{
                        posts:true
                    }
                }
            }
        })
        var found = false,waiting = false;
        room.UsersEnrolled.forEach((val)=>{
            if(val.userId == userId){
                if(val.joined)found = true;
                else waiting = true;
                return;
            }
        })
        if(found)return res.status(208).json({msg:"User Already joined!","UserEnrolled":room.UsersEnrolled});
        if(waiting)return res.status(208).json({msg:"Alrady Send request!Wait for Admin reply","UserEnrolled":room.UsersEnrolled});

        if(room.privateRoom)
        {
            try {
                return await prisma.$transaction(async(tsx)=>{
                    console.log("Inside Prisma transactrion");
                    const users = await tsx.enrolledRooms.create({
                        data:{
                            RoomId:room.id,
                            userId:userId,
                            joined:false
                        }
                    })
                    const notification= await tsx.notification.create({
                        data:{
                        title:`${room.title}`,
                        body:`Please Add Username: "${Username}" in your Private Room: "${room.title}"`,
                        toUser:room.CreatorId,
                        fromUser:userId,
                        }
                    });
                    return res.status(201).json({
                        msg:"Request Send!Wait for Admin Reply",
                        users,
                        notification
                    });
                })
            } catch (error) {
                return res.status(500).json({
                    msg:"Server Error",
                    error:e
                })
            }
        }
        const users = await prisma.enrolledRooms.create({
            data:{
                RoomId:room.id,
                userId:userId,
                joined:true
            }
        })


        return res.status(200).json({
            msg:"Joined",
            room,
            users
        })
    }
    catch(e)
    {
        return res.status(500).json({
            msg:"Server Error",
            error:e
        })
    }
}


export const leaveRoom = async(req,res)=>{
    const roomId = req.params.roomId;
    const userID = req.userId;

    try{
        const room = await prisma.rooms.findFirst({
            where:{
                id:roomId
            }
        });
        if(!room)return res.status(404).json({msg:'roomNotFound'})
        if(room.CreatorId === userID)
        {   
            const deletedRoom = await prisma.rooms.delete({
                where:{
                    id:room.id,
                },
            });
            return res.status(200).json({
                msg:"Room deleted",
                deletedRoom
            })
        }
        console.log(roomId);
        const userEnrolled = await prisma.enrolledRooms.delete({
            where: {
              userId_RoomId: {
                userId: userID,
                RoomId: roomId   
              }
            },
          });          
        return res.status(200).json({
            msg:"Left the room",
            userEnrolled
        })
    }
    catch(e)
    {
        return res.status(505).json({
            msg:"Server/Database Issue",
            error:e.message
        })
    }
}

export const sendJoiningRequest = async(req,res)=>{
    const userID = req.userId;
    const { title } = req.body;
    const { username } = req.params;
    // console.log("Sending Room Joining Request = ");
    // console.log(userID+" "+title+" "+username);
    if(!title || !username)
    {
        return res.status(404).json({
            msg:"Username/title is not found"
        })
    }

    try{
        // console.log("Inside try Catch block above usre");
        const user = await prisma.user.findFirst({
            where:{
                OR:[
                    {
                        username:username,
                    },
                    {
                        userID:username
                    }
                ]
            }
        });

        if(!user) return res.status(200).json({
            msg:"Please Enter Correct Username"
        })
        // console.log(user);
        // console.log("Above Room Fetching Block "+title);
        const room = await prisma.rooms.findFirst({
            where:{
                title,
            },
            include:{
                UsersEnrolled:true
            }
        });

        if(!room)return res.status(404).json({msg:"Room Not Found"});
        if(room.CreatorId != userID)return res.status(401).json({msg:"You are not authorised"});
        let found  =false;
        let waiting = false;
        // console.log("Above ForEach Bloco");
        room.UsersEnrolled.forEach((rooms)=>{
            if(rooms.userId === user.userID){
                if(rooms.joined)found = true;
                else waiting = true; 
            }
        })
        // console.log(found+" "+waiting)
        if(found){
            return res.status(200).json({
                msg:"User Already Present"
            })
        }
        if(waiting)
        {
            const enrollment = await prisma.enrolledRooms.update({
                where:{
                    userId_RoomId: {
                        userId: user.userID,
                        RoomId: room.id,
                        },
                },
                data:{
                    joined:true,
                }
            })
            // console.log(enrollment);
            if(enrollment) {
                return res.status(200).json({
                    msg:"User Added Successfully"
                })
            }
            else{
                return res.status(404).json({
                    msg:"Enrolled User Not found",
                    enrollment
                })
            }
        }
        try {
            const notification= await prisma.notification.create({
              data:{
                title:`Join My Room`,
                body:`Join Room: ${room.title} Click Here to Join Room`,
                toUser:user.userID,
                fromUser:userID,
              }
            });
            // console.log(notification);
            return res.status(201).json({
                msg:"Sended Request",
                notification
            });
            
          } catch (error) {
            console.log(error);
            
            res.status(403).json({
                msg:"Error In Sending Notification",
                error:error.message
            });
          }


    }
    catch(err){
        return res.status(500).json({
            msg:"Database/Server Issue",
            error:err.message
        })
    }
}

export const acceptJoiningRequest = async(req,res)=>{
    const userID = req.userId;
    const body = req.body;
    const roomTitle = body?.title.split(" ")[2];
    const creatorId = body?.fromUser;
    if(!roomTitle || !creatorId)return res.status(404).json({msg:"Wrong Input"});
    try {
        const room = await prisma.rooms.findFirst({
            where:{
                title:roomTitle,
            },
            include:{
                posts:true,
                UsersEnrolled:true
            }
        })
        if(!room)return res.status(404).json({msg:"Room Not Found"});
        if(room.CreatorId != creatorId)return res.status(404).json({msg:"Wrong Request Send"});

        const enrollment = await prisma.enrolledRooms.create({
            data:{
                userId:userID,
                RoomId:room.id,
                joined:true
            }
        })
        return res.status(200).json({
            msg:"Success",
            room,
            enrollment
        })
    } catch (error) {
        return res.status(500).json({
            msg:"Database/Server Issue",
            error:error?.message
        })
    }
}

//Trashes Need to clean
export const getPost = async(req,res)=>{
    const { title } = res.body;

    if(!title) return res.status(404).json({msg:"Title Not Found",posts:[]});

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    // console.log(offset, limit);

    try {
        const posts = await prisma.post.findMany({
        where:{
            subCommunity:title
        },
        include: {
            user: true,
            comments: {
            include: {
                user: true,
            },
            },
            upvotes: true,
            subCommunity:true
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: offset,
        take: limit,
        });
        posts.forEach((item,index)=>{
        posts[index].upvotes = posts[index].upvotes?.filter(upvote => upvote.commentId === null);
        })
        res.status(200).json({
            msg:"Success",
            posts
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Server/Database Error",
            error
        });
    }

}

export const getAPost = async(req,res)=>{
    const { title,id } = req.params;
    try {
        const post = await prisma.post.findUnique({
          where: {
            id
          },
          include: {
            user: true,
            comments: {
              include: {
                user: true,
              },
            },
            upvotes: true,
            subCommunity:true
          },
        });
        post.upvotes = post.upvotes.filter(upvote => upvote.commentId === null);
        res.status(200).json({
          post,
        });
      } catch (error) {
        console.log(error);
    
        res.status(500).json({
          msg: "Database/Server Issue",
          error
        });
      }
}