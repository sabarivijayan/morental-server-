import Car from "./car-model.js";
import Rentable from "./rentable-cars-model.js";
import Manufacturer from "./manufacturer-model.js";

Car.hasOne(Rentable,{
    foreignKey:'carId',
    onDelete: 'CASCADE',
});

Rentable.belongsTo(Car, {
    foreignKey: 'carId',
    targetKey: 'id',
    onDelete: 'CASCADE',
});
Manufacturer.hasMany(Car, {
    foreignKey: 'manufacturerId',
    as: 'cars',  // Alias for related cars
});
