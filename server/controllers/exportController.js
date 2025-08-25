import { query } from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createObjectCsvWriter } from "csv-writer";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_DIR = path.join(__dirname, "../public/exports");
if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR, { recursive: true });

export const exportUserData = async (req, res) => {
  try {
    const { userId, format } = req.query;
    const userRes = await query(
      "SELECT id_u, email, username, created_at, last_login FROM users WHERE id_u = $1",
      [userId]
    );
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const purchasesRes = await query(
      "SELECT id_purchase_history, purchase_date, total_amount, status FROM purchase_history WHERE id_u = $1",
      [userId]
    );
    const purchases = purchasesRes.rows;

    if (!["pdf", "csv"].includes(format)) {
      return res.status(400).json({ error: "Formato inválido" });
    }

    // Generar archivo temporal
    const fileName = `user_${userId}_data.${format}`;
    const filePath = path.join(EXPORT_DIR, fileName);

    if (format === "csv") {
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: "username", title: "Usuario" },
          { id: "email", title: "Email" },
          { id: "created_at", title: "Creado" },
          { id: "last_login", title: "Último acceso" },
          { id: "id_purchase_history", title: "ID Compra" },
          { id: "purchase_date", title: "Fecha" },
          { id: "total_amount", title: "Monto" },
          { id: "status", title: "Estado" },
        ],
      });

      const records = purchases.map((p) => ({
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        last_login: user.last_login || "Nunca",
        id_purchase_history: p.id_purchase_history,
        purchase_date: p.purchase_date,
        total_amount: p.total_amount,
        status: p.status,
      }));

      await csvWriter.writeRecords(records);
    }

    if (format === "pdf") {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));
      doc.fontSize(18).text("Datos del Usuario", { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(`Usuario: ${user.username}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Creado: ${user.created_at}`);
      doc.text(`Último acceso: ${user.last_login || "Nunca"}`);
      doc.moveDown();
      doc.fontSize(16).text("Historial de Compras", { underline: true });
      doc.moveDown();

      purchases.forEach((p, i) => {
        doc.fontSize(12).text(
          `${i + 1}. ${p.purchase_date} - $${p.total_amount} - ${p.status}`
        );
      });

      doc.end();
    }

    // Enviar archivo como descarga
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al exportar datos" });
  }
};
