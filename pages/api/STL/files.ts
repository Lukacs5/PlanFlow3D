import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // userId lekérése a kérés query paramétereiből vagy a törzsből
    const userId = req.query.userId || req.body.userId;

    if (userId) {
      const userFiles = await prisma.file.findMany({
        where: {
          OR: [
            { public: false },
            { userId: userId as string }
          ]
        }
      });
      res.status(200).json(userFiles);
    } else {
      // Ha nincs userId, csak a nyilvános fájlokat adja vissza
      const publicFiles = await prisma.file.findMany({
        where: { public: true }
      });
      res.status(200).json(publicFiles);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
