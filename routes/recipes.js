import * as inventoryController from "../controllers/recipes-controller.js";
import express from "express";
const router = express.Router();

router.route("/").get(inventoryController.all);
router.route("/random").get(inventoryController.random);

router.route("/ingredients").get(inventoryController.search);

export default router;
