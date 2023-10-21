import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, password, nickname ,mobileNumber} = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await prisma.User.create({
        data: {
          firstName,
          lastName,
          password:hashedPassword,
          nickname,
          mobileNumber,
        },
      });
      res.status(200).json(user); console.log(user.lastName)
    } catch (error) {
      console.error("Database Error:", error); // log the error
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
