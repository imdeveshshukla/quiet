import prisma from "../../db/db.config.js";

export const getUsers = async (req,res)=>{
    try {
        const {key}= req.query;
        console.log(req.query);
 
        
        let limit= 3;
        let users= await prisma.user.findMany({
            where:{
                username:{
                    contains: key,
                    mode: 'insensitive',
                }
            },
            take:limit,
        });
        res.status(200).send(users);
    } catch (error) {
        
    }
}