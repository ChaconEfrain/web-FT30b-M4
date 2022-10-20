const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Character",
    {
      code: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        allowNull: false,
        validate: {
          nameIsNot(value) {
            const normalizedValue = value.toLowerCase();
            if (normalizedValue === "henry")
              throw new Error("Name can't be a variation of 'Henry'");
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        get() {
          const rawValue = this.getDataValue("age");
          return rawValue ? `${rawValue} years old` : null;
        },
      },
      race: {
        type: DataTypes.ENUM(
          "Human",
          "Elf",
          "Machine",
          "Demon",
          "Animal",
          "Other"
        ),
        defaultValue: "Other",
      },
      hp: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      mana: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date_added: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};
