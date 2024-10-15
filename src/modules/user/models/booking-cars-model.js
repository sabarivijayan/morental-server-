import sequelize from "../../../config/database.js";
import Rentable from "../../admin/models/rentable-cars-model.js";
import { Model, DataTypes } from "sequelize";

class BookingCar extends Model {}

BookingCar.init({
    carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cars',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pickUpDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dropOffDate:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    totalPrice:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    razorpayOrderId:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    sequelize,
    modelName: 'BookingCar',
});

BookingCar.belongsTo(Rentable, {
    foreignKey: 'carId',
    as: 'rentable',
});

export default BookingCar;