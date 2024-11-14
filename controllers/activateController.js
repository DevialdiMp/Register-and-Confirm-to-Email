const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const activateUser = async (req, res) => {
    const { token } = req.params;

    try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
            }

            console.log("Decoded token:", decoded);

            const user = await prisma.user.findUnique({
                where: { email: decoded.email },
            });

            if (!user) {
                console.log("User tidak ditemukan di database");
                return res.status(400).json({ message: "Pengguna tidak ditemukan." });
            }

            await prisma.user.update({
                where: { email: decoded.email },
                data: { isActive: true },
            });

            res.status(200).json({ message: "Akun berhasil diaktifkan!" });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat mengaktifkan akun." });
    }
};

module.exports = { activateUser };