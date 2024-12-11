import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await knex("recipes").select("*").where("id", "=", id);
    data[0]["directions"] = JSON.parse(data[0]["directions"]);
    data[0]["ner"] = JSON.parse(data[0]["ner"]);
    res.status(200).send(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "An error occurred while fetching recipe." });
  }
};

let storedResult = null;
let cachedPage = null;
const all = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  if (storedResult && cachedPage === page) {
    res.json(storedResult);
    return;
  }
  try {
    const result = await knex("recipes")
      .select("id", "title", "ner", "directions")
      .orderBy("id")
      .limit(limit)
      .offset(offset);

    const countResult = await knex("recipes").count("id as total_rows").first();
    const totalRows = parseInt(countResult.total_rows, 10);
    const totalPages = Math.ceil(totalRows / limit);

    const parsedResult = result.map((recipe) => ({
      ...recipe,
      ner: JSON.parse(recipe.ner),
      directions: JSON.parse(recipe.directions),
    }));

    storedResult = {
      page,
      limit,
      totalRows,
      totalPages,
      recipes: parsedResult,
    };
    cachedPage = page;

    res.json(storedResult);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "An error occurred while fetching recipe." });
  }
};

const getRecipesByIngredients = async (req, res) => {
  const reqData = req.body;
  const page = parseInt(req.query.page) || 0;
  const ingredientIds = reqData.ingredients;
  const limit = 10000;

  const offset = page * limit;
  try {
    let validIds = [];
    let pushOffset = offset;

    while (validIds.length < 6) {
      const topRecipes = await knex("recipetoingredients")
        .select("recipe_id")
        .whereIn("ingredient_id", ingredientIds)
        .groupBy("recipe_id")
        .limit(limit)
        .offset(pushOffset);

      const recipes = await knex("recipetoingredients")
        .select("recipe_id", "ingredient_id")
        .whereIn(
          "recipe_id",
          topRecipes.map((item) => item.recipe_id)
        );

      const allRecipeIds = [];
      recipes.forEach((item) => {
        if (!allRecipeIds.includes(item.recipe_id))
          allRecipeIds.push(item.recipe_id);
      });
      const rejectedIds = [];
      recipes.forEach((row) => {
        if (
          !rejectedIds.includes(row.recipe_id) &&
          !ingredientIds.includes(row.ingredient_id)
        ) {
          rejectedIds.push(row.recipe_id);
        }
      });

      validIds = [
        ...validIds,
        ...allRecipeIds.filter((id) => !rejectedIds.includes(id)),
      ];
      pushOffset += limit;
    }
    const dataToSend = await knex("recipes")
      .select("title", "id", "directions")
      .whereIn(
        "id",
        validIds.map((id) => id)
      );
    const parsedResult = dataToSend.map((recipe) => ({
      ...recipe,
      directions: JSON.parse(recipe.directions),
    }));
    const currentPage = pushOffset / limit;

    res.json({ currentPage: currentPage, recipes: parsedResult });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("Server error while fetching recipes by ingredients.");
  }
};

const getRecipesByIngredients2 = async (req, res) => {
  const reqData = req.body;
  const page = parseInt(req.query.page) || 0;
  const ingredientIds = reqData.ingredients;
  const limit = 10;
  const offset = page * limit;
  try {
    if (!Array.isArray(ingredientIds) || ingredientIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or empty ingredient IDs." });
    }

    const unionAllParts = ingredientIds
      .map(() => `SELECT ? AS ingredient_id`)
      .join(" UNION ALL ");

    const topRecipes = await knex("recipetoingredients as r")
      .select("r.recipe_id")
      .groupBy("r.recipe_id")
      .havingRaw(
        `COUNT(DISTINCT r.ingredient_id) = COUNT(DISTINCT CASE WHEN r.ingredient_id IN (${ingredientIds
          .map(() => "?")
          .join(",")}) THEN r.ingredient_id END)`,
        [...ingredientIds]
      )
      .havingRaw(
        `COUNT(DISTINCT r.ingredient_id) <= (SELECT COUNT(DISTINCT ingredient_id) FROM (${unionAllParts}) AS s)`,
        ingredientIds
      )
      .orderByRaw("COUNT(DISTINCT r.ingredient_id) DESC")
      .limit(limit)
      .offset(offset);

    const dataToSend = await knex("recipes")
      .whereIn(
        "id",
        topRecipes.map((i) => i.recipe_id)
      )
      .select("title", "id", "directions");

    const parsedResult = dataToSend.map((recipe) => ({
      ...recipe,
      directions: JSON.parse(recipe.directions),
    }));

    res.json({ currentPage: page, recipes: parsedResult });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("Server error while fetching recipes by ingredients.");
  }
};

const searchIngredients = async (req, res) => {
  const s = req.query.s;

  try {
    const data = await knex("ingredients")
      .select("ingredients.id", "ingredients.name")
      .where((builder) => {
        if (s) {
          builder.where("name", "like", `%${s}%`);
        }
      })
      .limit(10);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(`Error retrieving inventories: ${error}`);
  }
};

const searchRecipes = async (req, res) => {
  const s = req.query.s;

  try {
    const data = await knex("recipes")
      .select("recipes.id", "recipes.title")
      .where((builder) => {
        if (s) {
          builder.where("title", "like", `%${s}%`);
        }
      })
      .limit(10);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving inventories: ${error}`);
  }
};

export {
  all,
  searchIngredients,
  getById,
  getRecipesByIngredients,
  getRecipesByIngredients2,
  searchRecipes,
};
