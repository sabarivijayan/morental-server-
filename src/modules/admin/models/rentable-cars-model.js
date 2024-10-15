import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import Car from "./car-model.js";

class Rentable extends Model {}

Rentable.init({
  carId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Cars",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  pricePerDay:{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  availableQuantity:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},{
    sequelize,
    modelName: "Rentable",
});

Rentable.belongsTo(Car, {
    foreignKey: 'carId',
    as: 'car',
});

export default Rentable;