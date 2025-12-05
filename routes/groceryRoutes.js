const express = require("express");
const upload = require("../utils/multer");
const { getItemsByShop, addShopItem, deleteShopItem, updateShopItem, addShop, getAllShops } = require("../controllers/groceryController.js");

const router = express.Router();

// Admin only (add shop)
router.post("/admin/shop", addShop);

router.get("/:shopId/items", getItemsByShop);     // items of 1 shop
router.post("/:shopId/item", upload.single("image"), addShopItem);
router.delete("/item/:itemId", deleteShopItem);
router.put("/item/:itemId",upload.single("image"), updateShopItem);
router.get("/shops", getAllShops);

module.exports = router;
