import * as inventoryController from "../controllers/recipes-controller.js";
import express from "express";
const router = express.Router();

router.route("/").get(inventoryController.all);
router
  .route("/ingredients")
  .get(inventoryController.search)
  .post(inventoryController.getRecipesByIngredients);
router.route("/:id").get(inventoryController.getById);
router.route("/random").get(inventoryController.random);

export default router;
