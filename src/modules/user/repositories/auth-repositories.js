import User from "../models/auth-model.js";

class AuthRepository{
    async createNewUser(data){
        return await User.create(data)
    }
    
    async findUserByPhoneNumber(phoneNumber){
        return await User.findOne({where: { phoneNumber }});
    }
    async updateUser (user){
        return await user.save();
    }
    async updateUserProfileImage(userId, profileImage){
        const user = await this.findById(userId);
        if(!user){
            throw new Error('User not found');
        }
        return user.update({profileImage});
    }
    async findById(id){
        return await User.findByPk(id);
    }
}

export default new AuthRepository();