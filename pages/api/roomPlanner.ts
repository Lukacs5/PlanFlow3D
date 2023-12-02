import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Feltételezve, hogy a kérés törzsében megkapja az összes szükséges mezőt
      const { userId, name, data } = req.body;
      // Alapértelmezett leírás, ha nincs megadva
      const description =req.body.description || "Ez egy alapértelmezett projekt leírása.";

      // Létrehozza az új projektet
      const newProject = await prisma.project.create({
        data: {
          userId,
          name,
          description,
          data: JSON.stringify(data), // A 'data' mezőt JSON stringként kezeli
          // Az 'createdAt' és 'updatedAt' automatikusan kezelve lesz
        },
      });

      res.status(200).json({ message: "Sikeres Mentés", newProject });
    } catch (error) {
      res.status(500).json({ message: "Mentés során hiba lépett fel", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
