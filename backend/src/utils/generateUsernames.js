import usernames from '../utils/usernames.js'
import prisma from "../../db/db.config.js";


function generateRandomUsername() {
    const randomWord = usernames[Math.floor(Math.random() * usernames.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000); 
    return `${randomWord}_${randomNumber}`;
  }


  async function generateUniqueUsernames(count = 5) {
    const usernames = [];
  
    while (usernames.length < count) {
      const username = generateRandomUsername();
      const exists = await prisma.user.findUnique({
        where: { 
            username
        },
      });
  
      if (!exists) {
        usernames.push(username);
      }
    }
  
    return usernames;
  }

export { generateUniqueUsernames };