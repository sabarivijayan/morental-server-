import dotenv from 'dotenv';
dotenv.config();

export const DB_HOST = process.env.DB_HOST
export const DB_NAME = process.env.DB_NAME 
export const DB_USER = process.env.DB_USER 
export const DB_PASS = process.env.DB_PASS 
export const SECRET_KEY = process.env.SECRET_KEY 