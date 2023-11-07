import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { boxesData, userId ,img ,name } = req.body;

    try {
      // Elmenti a kockák adatait a Blueprint táblában
      const savedData = await prisma.floorplan.create({
        data: {
          userId: userId,
          name:  name || "Blueprint Name" , // Adhatsz neki egy nevet
          data: boxesData,
          img : img
        }
      });

      res.status(200).json({ success: true, data: savedData });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: "An error occurred" });
      }
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
};
