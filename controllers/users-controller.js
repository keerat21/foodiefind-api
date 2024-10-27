import initKnex from "knex";
import configuration from "../knexfile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const knex = initKnex(configuration);
const { JWT_SECRET_KEY, PORT } = process.env;

export async function addUser(req, res) {
  const userData = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  try {
    const response = await knex("users").insert({
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
    });

    res.status(200).send("success");
  } catch (error) {
    res.status(501).send("failed adding user: " + error);
  }
}

export async function verifyUser(req, res) {
  const { email, password } = req.body;

  try {
    // Fetch user data from the database based on the provided email
    console.log({ email, password });
    const user = await knex("users")
      .select("*")
      .where("email", "=", email)
      .first();
    console.log("here" + user.username);

    // Check if the user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (isPasswordValid) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          userName: user.username,
        },
        JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500);
    console.error(error);
  }
}

export async function getUser(req, res) {
  console.log(req.user);
  res.json({ user: req.user });
}

export async function recipeLike(req, res) {
  console.log(req.body.recipe_id);
  try {
    await knex("user_recipes").insert({
      user_id: req.user.userId,
      recipe_id: parseInt(req.body.recipe_id),
    });
    res.status(200).json({ user: req.user.userId });
  } catch (error) {
    res.send(500);
    console.error(error);
  }
}

export async function getUserRecipes(req, res) {
  const userId = req.user.userId;
  try {
    const result = await knex("user_recipes")
      .select(
        "recipes.id",
        "recipes.title",
        "recipes.ner",
        "recipes.directions"
      )
      .rightJoin("recipes", "user_recipes.recipe_id", "recipes.id")
      .where("user_recipes.user_id", userId);
    const parsedResult = result.map((recipe) => ({
      ...recipe,
      ner: JSON.parse(recipe.ner),
      directions: JSON.parse(recipe.directions),
    }));
    res.status(200).json({ recipes: parsedResult });
  } catch (error) {
    res.send(500);
    console.error(error);
  }
}

export async function getUserIngredients(req, res) {
  const userId = req.user.userId;
  try {
    const result = await knex("user_ingredients")
      .select(
        "ingredients.id",
        "ingredients.name",
        "user_ingredients.is_available"
      )
      .rightJoin(
        "ingredients",
        "user_ingredients.ingredient_id",
        "ingredients.id"
      )
      .where("user_ingredients.user_id", userId);

    res.status(200).json({ ingredients: result });
  } catch (error) {
    res.send(500);
    console.error(error);
  }
}

export async function postUserIngredients(req, res) {
  const userId = req.user.userId;
  const { isAvailable, ingredientId } = req.body;
  try {
    const result = await knex("user_ingredients").insert({
      ingredient_id: ingredientId,
      user_id: userId,
      is_available: isAvailable,
    });

    res.status(200).json({ ingredients: result });
  } catch (error) {
    res.send(500);
    console.error(error);
  }
}

export async function updateUserIngredients(req, res) {
  const userId = req.user.userId;
  const { isAvailable, ingredientId } = req.body;
  try {
    const result = await knex("user_ingredients")
      .where({
        ingredient_id: ingredientId,
        user_id: userId,
      })
      .update({
        is_available: isAvailable,
      });

    res.status(200).json({ ingredients: result });
  } catch (error) {
    res.send(500);
    console.error(error);
  }
}
