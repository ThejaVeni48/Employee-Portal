const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { encrypt } = require("../utils/crypto");
const pool = require("../config/db"); 

// Test SMTP connection
router.post("/test", async (req, res) => {
  const { smtp_host, smtp_port, smtp_user, smtp_password } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: Number(smtp_port),
      secure: Number(smtp_port) === 465,
      auth: { user: smtp_user, pass: smtp_password },
    });
    await transporter.verify();
    return res.json({ success: true, message: "SMTP connection successful" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

// Save SMTP config
router.post("/save", async (req, res) => {
  const { company_id, smtp_host, smtp_port, smtp_user, smtp_password, from_email, from_name, use_tls } = req.body;
  if (!company_id || !smtp_host || !smtp_port || !smtp_user || !smtp_password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  try {
    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: Number(smtp_port),
      secure: Number(smtp_port) === 465,
      auth: { user: smtp_user, pass: smtp_password },
    });
    await transporter.verify();

    const encrypted = encrypt(smtp_password);
    const sql = `
      INSERT INTO email_config (company_id, smtp_host, smtp_port, smtp_user, smtp_password, from_name, from_email, use_tls, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
      ON DUPLICATE KEY UPDATE
        smtp_host = VALUES(smtp_host),
        smtp_port = VALUES(smtp_port),
        smtp_user = VALUES(smtp_user),
        smtp_password = VALUES(smtp_password),
        from_name = VALUES(from_name),
        from_email = VALUES(from_email),
        use_tls = VALUES(use_tls),
        updated_at = CURRENT_TIMESTAMP
    `;
    const params = [company_id, smtp_host, smtp_port, smtp_user, encrypted, from_name || "", from_email || "", use_tls ? 1 : 0];
    const conn = await pool.getConnection();
    await conn.query(sql, params);
    conn.release();

    res.json({ success: true, message: "Email config saved successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post("/send", async (req, res) => {
  const { smtp_host, smtp_port, smtp_user, smtp_password, to, subject, message } = req.body;

  if (!smtp_host || !smtp_user || !smtp_password || !to || !subject || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: smtp_port == 465,
      auth: {
        user: smtp_user,
        pass: smtp_password,
      },
    });

    const mailOptions = {
      from: smtp_user,
      to,
      subject,
      html: `<p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
  }
});


module.exports =router;