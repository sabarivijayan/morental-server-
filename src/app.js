import express from "express"; // Import Express framework
import { ApolloServer } from "apollo-server-express"; // Import Apollo Server for GraphQL
import { typeDefs, resolvers } from "./graphql/schema.js"; // Import GraphQL type definitions and resolvers
import sequelize from "./config/database.js"; // Import your Sequelize database configuration
import cors from "cors"; // Import CORS middleware for handling cross-origin requests
import { graphqlUploadExpress } from "graphql-upload"; // Import middleware for handling file uploads
import dotenv from "dotenv"; // Import dotenv for environment variable management
import "./modules/admin/models/relations-model.js"; // Import model relations (if needed)
import seedAdmin from "./seed.js"; // Import admin seeding script
import { startCleanupCron } from "./utils/bookingCleanup.js";
dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application
const PORT = process.env.PORT || 5000; // Set the port for the server

// Create a new Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,

  // Custom error formatting
  formatError: (error) => {
    console.log(error); // Log the error details

    if (error) {
      return {
        message: error.message, // Return error message
        code: error.extensions?.code || "INTERNAL_SERVER_ERROR", // Return error code or default to internal server error
      };
    }
  },

  // Context to extract authorization token from request headers
  context: ({ req }) => {
    const token = req.headers.authorization || ""; // Extract token from headers
    return { token }; // Return the token in the context
  },
});

app.use(cors()); // Enable CORS for all routes

// Middleware for handling file uploads
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

app.use("/uploads", express.static("uploads")); // Serve static files from the "uploads" directory

// Function to start the server
const startServer = async () => {
  await server.start(); // Start the Apollo Server
  server.applyMiddleware({ app }); // Apply Apollo middleware to the Express app

  // Start the Express server
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`); // Log server start
    console.log(
      `GraphQL ready to run at http://localhost:${PORT}${server.graphqlPath}` // Log GraphQL endpoint
    );
    try {
      await sequelize.sync({ alter: true }); // Sync the database
      console.log("Database synced successfully."); // Log successful sync

      startCleanupCron();
      console.log("Cleanup cron job started.");
    } catch (error) {
      console.error("Error syncing database: ", error); // Log sync errors
    }
  });
};

// Error handling middleware for Express
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).send("Something broke!"); // Send a generic error response
});

// Start the server
startServer();