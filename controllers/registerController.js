const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_APP,
    },
});

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET);

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Pengguna dengan email ini sudah terdaftar." });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                isActive: false,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Konfirmasi Pendaftaran",
            text: `Halo ${name}, silahkan konfirmasi pendaftaran anda dengan klik link di bawah ini.`,
            html: `<p>Halo ${name},</p><p>Silahkan klik link berikut untuk mengaktifkan akun anda:</p>
                   <a href="http://localhost:3000/api/users/activate/${token}">Konfirmasi Akun</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error detail:", err);
                return res.status(500).json({ message: "Gagal mengirim email konfirmasi." });
            }
            res.status(200).json({ message: "Registrasi berhasil! Silahkan cek email untuk konfirmasi." });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { registerUser };