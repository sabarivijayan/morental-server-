import RentableCarHelper from "../../helpers/rentable-cars-helpers.js";


const RentableCarResolver = {
    Query: {
        getRentableCarsWithId: async(_, {id})=>{
            return await RentableCarHelper.getRentableCarById(id);
        }
    },
}

export default RentableCarResolver;