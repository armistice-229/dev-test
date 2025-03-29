const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

// Route d'inscription
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Route de connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Connexion réussie", token });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Route protégée - Accès uniquement aux utilisateurs authentifiés
router.get("/profile", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // On exclut le mot de passe
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  });


// Route de déconnexion (supprime le token côté client)
router.post("/logout", authMiddleware, (req, res) => {
  res.json({ message: "Déconnexion réussie. Veuillez supprimer le token côté client." });
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

      const { name, email } = req.body;

      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      res.json({ message: "Profil mis à jour avec succès" });
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
