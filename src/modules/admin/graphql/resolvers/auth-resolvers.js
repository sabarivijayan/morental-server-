import adminHelper from "../../helpers/admin-helper.js";
import Admin from "../../models/admin-model.js";
import { validateLogin } from "../../../../utils/JOI/admin-joi.js";

const authResolver ={
    Query:{
        getAdmin: async (_, { id }) =>{
            try {
                const admin = await Admin.findByPk(id);
                if(!admin){
                    throw new Error('Admin not found');
                }
                return admin;
            } catch (error) {
                throw new Error ('Admin not found');
            }
        },
    },

    Mutation:{
        adminLogin: async (_, { email, password }) =>{
            try {

                validateLogin({email, password});
                const admin = await adminHelper.findAdminByEmail(email);
                if(!admin) {
                    throw new Error('Invalid credentials');
                }

                const isPasswordValid = await adminHelper.validatePassword(password, admin.password);
                if(!isPasswordValid) {
                    throw new Error('Invalid credentials');
                }

                const token = adminHelper.generateToken(admin);

                return{
                    token,
                    admin: {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                        role: admin.role,
                        createdAt: admin.createdAt,
                        updatedAt: admin.updatedAt,
                    },
                };
            } catch (error) {
                console.error('Login error: ', error.message);
                throw new Error('Login failed: ' + error.message);
            }
        },
    },
};
export default authResolver;