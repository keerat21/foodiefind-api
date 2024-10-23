import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const all = async (req, res) => {
  // Get the page and limit from query parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

  // Calculate offset
  const offset = (page - 1) * limit;

  try {
    // Query to get paginated products
    const result = await knex("recipes")
      .select("*")
      .orderBy("id")
      .limit(limit)
      .offset(offset);

    // Query to get total count of products
    const countResult = await knex("recipes").count("id as total_rows").first();
    const totalRows = parseInt(countResult.total_rows, 10);
    const totalPages = Math.ceil(totalRows / limit);

    // Send response with paginated data
    res.json({
      page,
      limit,
      totalRows,
      totalPages,
      recipes: result,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
};

const random = async (req, res) => {
  // Get the page and limit from query parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

  // Calculate offset
  const offset = (page - 1) * limit;

  try {
    // Query to get paginated products
    const result = await pool.query(
      "SELECT * FROM recipes ORDER BY product_id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    // Query to get total count of products
    const countResult = await pool.query(
      "SELECT COUNT(*) AS total_rows FROM recipes"
    );
    const totalRows = parseInt(countResult.rows[0].total_rows, 10);
    const totalPages = Math.ceil(totalRows / limit);

    // Send response with paginated data
    res.json({
      page,
      limit,
      totalRows,
      totalPages,
      products: result.rows,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
};

const search = async (req, res) => {
  const s = req.query.s;

  try {
    const data = await knex("ingredients")
      .select("ingredients.id", "ingredients.name")
      .where((builder) => {
        if (s) {
          builder.where("name", "like", `%${s}%`);
        }
      })
      .orderByRaw("LENGTH(name)") // Sort by the length of the ingredient names
      .limit(10); // Select only the top 10 results

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(`Error retrieving inventories: ${error}`);
  }
};

export { all, search, random };
