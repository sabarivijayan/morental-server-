import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql/schema.js";
import sequelize from "./config/database.js"; // Your Sequelize config
import cors from "cors";
import { graphqlUploadExpress } from "graphql-upload";
import dotenv from "dotenv";
import "./modules/admin/models/relations-model.js";
import seedAdmin from "./seed.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,


  formatError: (error) => {
    console.log(error);

    if (error) {
      console.log(err);
      return {
        message: err.message,
        code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    }
  },

  context: ({ req }) => {
    const token = req.headers.authorization || "";
    return { token };
  },
});

app.use(cors());

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

app.use("/uploads", express.static("uploads"));



const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(
      `GraphQL ready to run at http://localhost:${PORT}${server.graphqlPath}`
    );
    try {
      await sequelize.sync({ alter: true });
      console.log("Database synced successfully.");
    } catch (error) {
      console.error("Error syncing database: ", error);
    }
  });
};

app.use((err,req,res,next) =>{
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

startServer();