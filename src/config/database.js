// Import the Sequelize class from the sequelize module
import { Sequelize } from 'sequelize';

// Import database configuration from a separate file
import { DB_NAME, DB_HOST, DB_USER, DB_PASS } from './config.js';

// Create a new Sequelize instance with the database credentials
const sequelize = new Sequelize(
  // Database name
  DB_NAME,
  // Database username
  DB_USER,
  // Database password
  DB_PASS,
  {
    // Database host
    host: DB_HOST,
    // Database dialect (in this case, PostgreSQL)
    dialect: 'postgres',
    // Disable logging of database queries
    logging: false
  }
);

// Export the Sequelize instance as the default export
export default sequelize;