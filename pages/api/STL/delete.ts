import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { fileId, userId } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Lekérjük a fájlt az adatbázisból
      const file = await prisma.file.findUnique({
        where: { id: fileId as string },
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Ellenőrizzük, hogy a fájl a felhasználóé-e
      if (file.userId !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this file' });
      }

      // Töröljük a fájlt a fájlrendszerből
      const filePath = path.join(process.cwd(), file.fileRoot, file.filename);
      await fs.unlink(filePath);

      // Töröljük a rekordot az adatbázisból
      await prisma.file.delete({
        where: { id: fileId as string },
      });

      res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
