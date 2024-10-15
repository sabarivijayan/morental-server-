import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js'; // Assuming you have a configured sequelize instance

const Manufacturer = sequelize.define('Manufacturer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Manufacturer;
