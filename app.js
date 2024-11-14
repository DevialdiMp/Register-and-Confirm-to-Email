const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
app.use(express.json());

// Gunakan route untuk user
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Hallo! Devialdi Maisa Putra");
    console.log(`Server berjalan pada port ${PORT}`);
});
