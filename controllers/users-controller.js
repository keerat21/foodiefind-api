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
    const Checkuser = await knex("users")
      .select("*")
      .where("email", "=", userData.email)
      .first();

    if (Checkuser) {
      return res.status(409).send("User already exists");
    }

    const response = await knex("users").insert({
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
    });

    const user = await knex("users")
      .select("*")
      .where("email", "=", userData.email)
      .first();

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password_hash
    );

    if (isPasswordValid) {
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
    } else res.status(401).send("login problem");
  } catch (error) {
    res.status(501).send("failed adding user: " + error);
  }
}

export async function verifyUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await knex("users")
      .select("*")
      .where("email", "=", email)
      .first();

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (isPasswordValid) {
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
  res.json({ user: req.user });
}

export async function recipeLike(req, res) {
  try {
    await knex("user_recipes").insert({
      user_id: req.user.userId,
      recipe_id: parseInt(req.body.recipe_id),
    });

    const ingredientIds = await knex("recipetoingredients")
      .select("ingredient_id")
      .where({ recipe_id: req.body.recipe_id });

    const insertData = ingredientIds.map(({ ingredient_id }) => ({
      user_id: req.user.userId,
      ingredient_id,
    }));

    await knex("user_ingredients")
      .insert(insertData)
      .onConflict(["user_id", "recipe_id"])
      .ignore();
    res.status(200).json({ user: req.user.userId });
  } catch (error) {
    res.send(500);
    console.error(error);
  }
}

export async function recipeLikeCheck(req, res) {
  const { id } = req.params;

  try {
    const result = await knex("user_recipes")
      .select()
      .where({
        user_id: req.user.userId,
        recipe_id: parseInt(id),
      })
      .first();

    const exists = !!result;
    res.status(200).json({ exists });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error checking recipe like status." });
  }
}

export async function removeLike(req, res) {
  const { id } = req.params;

  try {
    const result = await knex("user_recipes")
      .where({
        user_id: req.user.userId,
        recipe_id: parseInt(id),
      })
      .delete();

    const exists = !!result;
    res.status(200).json({ exists });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error checking recipe like status." });
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

export async function deleteIngredient(req, res) {
  const userId = req.user.userId;
  const ingredientId = req.query.id;
  try {
    const result = await knex("user_ingredients")
      .where({
        ingredient_id: ingredientId,
        user_id: userId,
      })
      .delete();

    res.status(200).send({ message: "Ingredient deleted successfully." });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete ingredient." });
    console.error(error);
  }
}
