import { PrismaClient } from "@prisma/client";
const prisma= new PrismaClient()
async function connectDB() {
    try {
        const res = await prisma.$connect()
        console.log("Database Connected SuccessFully");
    } catch (error) {
        console.log("Error In Connecting with database");
        console.log(error.message);
    }
}
connectDB();
export default prisma