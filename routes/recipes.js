import express from "express";

import * as inventoryController from "../controllers/recipes-controller.js";
const router = express.Router();

router.route("/").get(inventoryController.all);
router
  .route("/ingredients")
  .get(inventoryController.search)
  .post(inventoryController.getRecipesByIngredients);
router.route("/:id").get(inventoryController.getById);

export default router;
