import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable"; // Updated import
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new IncomingForm(); // Updated usage

    form.parse(req, async (err, fields, files) => {
      const userId = Array.isArray(fields.userId)
        ? fields.userId[0]
        : fields.userId || "";
      const isPublic = Array.isArray(fields.public)
        ? fields.public[0] === "true"
        : fields.public === "true";

      if (err) {
        res.status(500).json({ error: "Fájlfeltöltési hiba." });
        return;
      }

      const uploadedFiles = files.file;
      if (!uploadedFiles || !Array.isArray(uploadedFiles)) {
        res.status(400).json({ error: "Nincs megfelelő fájl a kérésben." });
        return;
      }

      const uploadedFile = uploadedFiles[0];
      if (!uploadedFile.originalFilename) {
        res.status(400).json({ error: "A fájl név hiányzik." });
        return;
      }

      const filename = uploadedFile.originalFilename;
      const fileRoot = "/stls/"; // Eltávolítottuk a kezdő '/'
      const uploadPath = path.resolve(process.cwd(), fileRoot);
      const newPath = path.join(uploadPath, filename);

      try {
        await fs.copyFile(uploadedFile.filepath, newPath);

        const fileData = {
          userId: userId,
          public: isPublic,
          filename,
          fileRoot,
        };

        const savedFile = await prisma.file.create({
          data: fileData,
        });

        res
          .status(200)
          .json({ message: "Fájl sikeresen feltöltve", file: savedFile });
      } catch (error) {
        console.error("Fájl mentési hiba: ", error);
        res.status(500).json({ error: "Fájl mentési hiba." });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
