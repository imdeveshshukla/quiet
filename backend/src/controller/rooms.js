import prisma from "../../db/db.config";
import z from 'zod'
import uploadOnCloudinary from "../utils/cloudinary";

const roomSchema = z.object({
    title:z.string().min(3,"Name Should contains atleast 5 Characters"),
    desc:z.string().min(10,"Description Should Contains atleast 10 Characters").optional(),
    img:z.boolean(),
    privacy:z.boolean()
})
export const CreateRoom = async (req,res)=>{
    const data = req.body;//{title,desc,img,privacy}
    const userId = req.userId;
    const verifySchema = roomSchema.safeParse(data);
    if(!verifySchema.success){
        return res.status(400).json({
        msg:"Wrong Input",
                error:verifySchema.error
            });
    }
    let imgUrl = null;
    if(data.img){ //req.file.path
        imgUrl = uploadOnCloudinary(req.file.path);
    }
    try{
        await prisma.$transaction(async(tx)=>{
            const newRoom = await prisma.rooms.create({
                data:{
                    title:data.title,
                    desc:data.desc,
                    img:imgUrl,
                    privateRoom:data.privacy,
                    CreatorId:userId
                }
            })
            if(newRoom.id && newRoom.CreatorId)
            {
                const enrolled = await prisma.enrolledRooms.create({
                    data:{
                        userId:newRoom.CreatorId,
                        RoomId:newRoom.id
                    }
                })
                return res.status(201).json({
                    msg:"Successfully Created",
                    newRoom,
                    enrolled
                })
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
}

export const updateRoom = async(req,res)=>{
    const data = req.body;
    const {update} = req.body;
    const userId = req.userId;
    const id = data.id;
    try{
        const room = await prisma.rooms.findFirst({
            where:{
                id
            }
        })
        if(!room.id)return res.status(404).json({msg:"Room Not Found!"});

        if(room.CreatorId != userId){
            return res.status(401).json({
                msg:"You don't have permission to perform changes in this room"
            })
        }
        let imgUrl = null;
        if(data.img) imgUrl = uploadOnCloudinary(req.file.path);

        const updatedRoom = await prisma.rooms.update({
            where:{
                id:room.id
            },
            data:{
                title:data.title,
                desc:data.desc,
                img:imgUrl
            }
        });

        req.status(200).json({
            msg:"Success",
            updatedRoom
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

export const deleteRoom =async(res,req)=>{
    const data = req.body;
    const userId = req.userId;
    if(data.id != userId) return res.status(401).json({msg:"You don't have permission to Perform this Action"});
    try{
        await prisma.$transaction(async(tx)=>{
            const deletedRoom = await prisma.rooms.delete({
                where:{
                    id:data.id,
                },
            });

            const enrolled = await prisma.enrolledRooms.delete({
                where:{
                    RoomId:data.id,
                },
            });

            return res.status(200).json({
                msg:"Success".
                deletedRoom,
                enrolled
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


