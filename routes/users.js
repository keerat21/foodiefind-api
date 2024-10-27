import * as userController from "../controllers/users-controller.js";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

const { JWT_SECRET_KEY, PORT } = process.env;

function authenticateToken(req, res, next) {
  // string split example:
  // "Bearer token"
  // ["Bearer",  "token"]
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No JWT provided" });
  }
  const token = req.headers.authorization.split(" ")[1]; // get the 2nd element in the array after splitting the string "Bearer token"

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(498).json({ message: "Token validation failed" });
    }
    req.user = decoded; // attaches the decoded user data to req.user
    req.favColour = "skyblue";
    req.timeOfRequest = Date.now();
    next();
  });
}

router.route("/register").post(userController.addUser);
router.route("/verify").post(userController.verifyUser);
router.get("/user", authenticateToken, userController.getUser);

export default router;