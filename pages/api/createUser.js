import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { firstName, lastName, password, nickname, email } = req.body;

  if (!firstName || !lastName || !password || !nickname || !email) {
    return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Nem megfelelő e-mail formátum." });
  }

  const existingUser = await prisma.User.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "Ezzel az e-maillel már regisztráltak." });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d-!@#$%^&*()_+[\]{};':"\\|,.<>/?áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: "A jelszónak tartalmaznia kell minimum 8 karaktert, egy kisbetűt, egy nagybetűt és egy számot."
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.User.create({
      data: {
        firstName,
        lastName,
        password: hashedPassword,
        nickname,
        email,
      },
    });

    const token = jwt.sign({ userId: user.id }, "your_secret_key", { expiresIn: "10h" });

    res.status(200).json({ user, token });
    console.log(user.lastName);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error" });
  }
}
