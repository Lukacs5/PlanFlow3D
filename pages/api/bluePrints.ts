import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Csak GET kéréseket fogadunk el
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  const { id, userId } = req.query;

  if (id) {
    try {
      // Lekérdezzük az egyedi alaprajzot az ID alapján
      const floorplan = await prisma.floorplan.findUnique({
        where: { id: String(id) },
      });
      if (floorplan) {
        res.status(200).json(floorplan);
      } else {
        res.status(404).json({ message: 'Alaprajz nem található.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Szerverhiba történt.' });
    }
  } else if (userId) {
    try {
      // Lekérdezzük az összes alaprajzot, amely a felhasználóhoz kapcsolódik
      const floorplans = await prisma.floorplan.findMany({
        where: { userId: String(userId) },
      });
      res.status(200).json(floorplans);
    } catch (error) {
      res.status(500).json({ message: 'Szerverhiba történt.' });
    }
  } else {
    res.status(400).json({ message: 'Hiányzó paraméter.' });
  }
}
