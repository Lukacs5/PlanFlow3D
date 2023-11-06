import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(400).json({ error: 'Érvénytelen belépési adatok' });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ error: 'Érvénytelen belépési adatok' });
      }

      // JWT token generálása
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '10h' });

      return res.status(200).json({ message: 'Sikeres bejelentkezés', token: token });
    } catch (error) {
      console.error('Hiba a bejelentkezés során:', error);
      return res.status(500).json({ error: 'Szerver hiba' });
    }
  }

  return res.status(405).end();
}
