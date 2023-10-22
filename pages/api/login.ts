import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'



export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        email:email
      },
    })

    if (!user) {
      return res.status(400).json({ error: 'Érvénytelen belépési adatok' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Érvénytelen belépési adatok' })
    }

    return res.status(200).json({ message: 'Sikeres bejelentkezés' })
  }

  return res.status(405).end()
}
