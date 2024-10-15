import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../config/database.js'

class User extends Model {}

User.init({
    firstName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[0-9]{10}$/,
        },
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate:{
            isEmail: true,
        },
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    city:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    state:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    country:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    pincode:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9]{6}$/,
        },
    },
    profileImage:{
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    sequelize,
    modelName: 'User',
    timestamps: true,
})
  export default User;
  