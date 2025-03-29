require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


app.use(express.static(path.join(__dirname, "public")));


// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
  
// Routes de base
app.get("/", (req, res) => {
  res.send("Bienvenue dans notre API d'authentification !");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
