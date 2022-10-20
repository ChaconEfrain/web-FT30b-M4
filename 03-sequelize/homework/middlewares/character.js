const { Router } = require("express");
const { Op, Character, Role } = require("../db");
const Ability = require("../db/models/Ability");
const router = Router();

router.post("/", async (req, res) => {
  const { code, name, hp, mana } = req.body;
  if (!code || !name || !hp || !mana)
    return res.status(404).send("Falta enviar datos obligatorios");
  try {
    const newCharacter = await Character.create({ ...req.body });
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(404).send("Error en alguno de los datos provistos");
  }
});

router.get("/", async (req, res) => {
  const { race, age } = req.query;
  try {
    if (race && age) {
      const characters = await Character.findAll({
        where: {
          [Op.and]: {
            race,
            age,
          },
        },
      });
      return res.json(characters);
    }
    if (race) {
      const characters = await Character.findAll({
        where: {
          race,
        },
      });
      return res.json(characters);
    }
    const characters = await Character.findAll();
    res.json(characters);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/young", async (req, res) => {
  try {
    const youngChars = await Character.findAll({
      where: {
        age: {
          [Op.lt]: 25,
        },
      },
    });
    res.json(youngChars);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/roles/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const character = await Character.findByPk(code, {
      include: Role,
    });
    res.json(character);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const character = await Character.findByPk(code);
    if (character) return res.json(character);
    res
      .status(404)
      .send(`El código ${code} no corresponde a un personaje existente`);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/addAbilities", async (req, res) => {
  const { codeCharacter, abilities } = req.body;
  try {
    abilities.forEach(async (ability) => await Ability.create({ ...ability }));
    const character = await Character.setAbilities(codeCharacter);
    res.json(character);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:attribute", async (req, res) => {
  try {
    const { attribute } = req.params;
    const { value } = req.query;
    await Character.update(
      {
        [attribute]: value,
      },
      {
        where: { [attribute]: null },
      }
    );
    res.send("Personajes actualizados");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
