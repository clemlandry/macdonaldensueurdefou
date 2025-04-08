const express = require("express");
const cors = require("cors");
require("dotenv").config(); // 🔁 Charge les variables .env

const { Pokemon, Profil } = require("../models");

const app = express();
const PORT = 5058;

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.send("pong");
});

// 🟡 Auth Discord fusionnée ici
app.post("/auth/discord", async (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: "Code manquant" });

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.REDIRECT_URI);
    params.append("scope", "identify");

    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const access_token = tokenResponse.data.access_token;

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = userResponse.data;

    res.json({
      id: user.id,
      username: user.username,
      avatar: user.avatar
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erreur durant l'authentification" });
  }
});

// Récupère les Pokémon d’un joueur à partir de son userId
app.get("/api/pokemons/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const profil = await Profil.findOne({ where: { userId } });
    if (!profil) return res.status(404).json({ error: "Profil non trouvé." });

    const pokemons = await Pokemon.findAll({ where: { profilId: profil.id } });
    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.patch("/api/pokemons/updateEquipe", async (req, res) => {
  

  try {
    const { id, equipe } = req.body;
const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) return res.status(404).json({ error: "Pokémon introuvable" });

    pokemon.equipe = equipe;
    await pokemon.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur updateEquipe:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.patch("/api/pokemons/rename", async (req, res) => {
  const { id, surnom } = req.body;
  console.log("🔧 PATCH /rename :", { id, surnom }); // 👈

  try {
    const pokemon = await Pokemon.findByPk(id);
    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon introuvable" });
    }

    pokemon.surnom = surnom;
    await pokemon.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur dans /rename:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});




module.exports = {
  startApiServer: () => {
    app.listen(PORT, () => {
      console.log(`🚀 API en ligne sur http://localhost:${PORT}`);
    });
  },
};
