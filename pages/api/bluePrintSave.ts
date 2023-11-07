import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Elnevezett függvény létrehozása
async function saveBlueprint(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { boxesData, userId, img, name } = req.body;

    try {
      const savedData = await prisma.floorplan.create({
        data: {
          userId,
          name: name || "Blueprint Name",
          data: boxesData,
          img: img || "default_image_placeholder.png" // A "asd" helyett használjon valós kép elérési utat vagy hagyja üresen
        }
      });

      res.status(200).json({ success: true, data: savedData });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: "An error occurred" });
      }
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

// Az elnevezett függvény exportálása
export default saveBlueprint;
