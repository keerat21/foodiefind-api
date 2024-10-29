import * as userController from "../controllers/users-controller.js";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

const { JWT_SECRET_KEY, PORT } = process.env;

function authenticateToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No JWT provided" });
  }
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(498).json({ message: "Token validation failed" });
    }
    req.user = decoded;
    req.favColour = "skyblue";
    req.timeOfRequest = Date.now();
    next();
  });
}

router.route("/register").post(userController.addUser);
router.route("/verify").post(userController.verifyUser);
router.route("/user").get(authenticateToken, userController.getUser);
router.route("/like").post(authenticateToken, userController.recipeLike);
router
  .route("/like/:id")
  .get(authenticateToken, userController.recipeLikeCheck)
  .delete(authenticateToken, userController.removeLike);
router.route("/recipes").get(authenticateToken, userController.getUserRecipes);
router
  .route("/ingredients")
  .get(authenticateToken, userController.getUserIngredients)
  .post(authenticateToken, userController.postUserIngredients)
  .put(authenticateToken, userController.updateUserIngredients)
  .delete(authenticateToken, userController.deleteIngredient);

export default router;
