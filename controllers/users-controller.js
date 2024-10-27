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
