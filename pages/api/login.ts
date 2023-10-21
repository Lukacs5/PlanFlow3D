import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { nickname, password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        nickname: nickname
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
