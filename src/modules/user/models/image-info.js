// models/image-info.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/database.js'; // Adjust this import according to your setup

class ImageInfo extends Model {}

ImageInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize,
    modelName: 'ImageInfo',
  }
);

export default ImageInfo;
