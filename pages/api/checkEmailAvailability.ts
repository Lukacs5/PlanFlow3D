import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function checkEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ellenőrzi, hogy a kérés metódusa GET-e
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  // Lekéri az e-mail címet a kérés paramétereiből
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'E-mail cím szükséges!' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.json({ isTaken: true });
    } else {
      return res.json({ isTaken: false });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Adatbázis hiba!' });
  }
}
