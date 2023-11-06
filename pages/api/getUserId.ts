import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ha az e-mail cím tömbként érkezik, vegyük az első elemet, egyébként használjuk magát az értéket
  const emailParam = req.query.email;
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;

  try {
    // Ellenőrizés, hogy az e-mail cím paraméter meg van-e adva
    if (!email) {
      return res.status(400).json({ error: 'E-mail cím szükséges a lekérdezéshez.' });
    }

    // Lekérdezzük a felhasználót az e-mail címe alapján
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(), // Kisbetűsítjük az e-mail címet
      },
      select: {
        id: true, // Csak az id-t kérjük le
      },
    });

    if (user) {
      // Sikeres lekérdezés esetén visszaadjuk a felhasználói azonosítót
      res.json({ userId: user.id });
    } else {
      // Ha nincs ilyen felhasználó, 404-es választ küldünk
      res.status(404).json({ error: 'Nincs felhasználó ezzel az e-mail címmel.' });
    }
  } catch (error) {
    // Általános hibakezelés
    res.status(500).json({ error: 'Hiba történt a szerveren.' });
    console.error('Hiba az API végpontban: ', error instanceof Error ? error.message : error);
  } finally {
    // Felszabadítjuk a Prisma Client erőforrásait
    await prisma.$disconnect();
  }
}
