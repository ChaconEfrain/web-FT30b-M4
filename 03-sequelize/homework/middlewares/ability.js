const { Router } = require("express");
const { Ability } = require("../db");
const router = Router();

router.post("/", async (req, res) => {
  const { name, mana_cost } = req.body;
  try {
    if (!name || !mana_cost)
      return res.status(404).send("Falta enviar datos obligatorios");
    const newAbility = await Ability.create({ ...req.body });
    res.status(201).json(newAbility);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/setCharacter", async (req, res) => {
  const { idAbility, codeCharacter } = req.body;
  try {
    const ability = await Ability.findByPk(idAbility);
    if (ability) {
      await ability.setCharacter(codeCharacter);
      res.json(ability);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
