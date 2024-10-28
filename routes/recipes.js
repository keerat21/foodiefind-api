import express from "express";

import * as inventoryController from "../controllers/recipes-controller.js";
const router = express.Router();

router.route("/").get(inventoryController.all);
router.route("/search").get(inventoryController.searchRecipes);
router
  .route("/ingredients")
  .get(inventoryController.searchIngredients)
  .post(inventoryController.getRecipesByIngredients2);
router.route("/:id").get(inventoryController.getById);

export default router;
