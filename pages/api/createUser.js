import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, password, nickname } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          password, // Ne felejtsd el hashelni a jelszót valós alkalmazásokban!
          nickname,
          mobileNumber,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
