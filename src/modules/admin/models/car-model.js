import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import Manufacturer from "./manufacturer-model.js";

class Car extends Model {}

Car.init({
  manufacturerId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: "Manufacturers",
      key: "id",
    },
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfSeats: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fuelType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transmissionType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  primaryImageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  secondaryImagesUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING(1000)),
    allowNull: true,
  },
  year:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRentedOrNot:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt:{
    type: DataTypes.DATE,
    allowNull: true,
  },
},{
    sequelize,
    modelName: "Car",
    paranoid: true,
});

Car.belongsTo(Manufacturer, {
    foreignKey: "manufacturerId",
    as: 'manufacturer',
    onDelete: 'SET NULL'
});

export default Car;