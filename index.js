import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import recipeRoutes from "./routes/recipes.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", express.static("public"));

app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log("Working on PORT:", PORT);
});
