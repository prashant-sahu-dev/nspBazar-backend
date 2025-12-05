const cloudinary = require("../utils/cloudinary");
const Item = require("../models/item");
const Shop = require("../models/shop");

const getItemsByShop = async (req, res) => {
  try {
    let { shopId } = req.params;
    // Check valid shop
    shopId = shopId.replace(/"/g, "").trim(); // remove quotes + spaces
    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json({
      shop: shop.name,
      count: shop.items.length,
      items: shop.items
    });

  } catch (err) {
    console.error("GET ITEMS BY SHOP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


async function addShopItem(req, res){
  let { shopId } = req.params;
  
  shopId = shopId.replace(/"/g, "").trim(); // remove quotes + spaces
  const { name, mrp, price, weight, shopName, category } = req.body;
  const image = req.file?.path; // Cloudinary URL
  if (!image) {
    return res.status(400).json({ message: "Image upload failed" });
  }
  const shopExists = await Shop.findById(shopId);

  if (!shopExists) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const item = await Item.create({
    name,
    mrp,
    price,
    image,
    weight,
    shopName,
    category,
    shopId
  });

  // item ko shop ke items array me push karna (optional)
  shopExists.items.push(item._id);
  await shopExists.save();

  res.json({ message: "Item added successfully", item });
}

// UPDATE ITEM
const updateShopItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body; // {name, price, mrp, weight,category, image}
    
     // If new image uploaded → save new URL
    if (req.file) {
      updates.image = req.file?.path;
    }

    // 1️⃣ Find and update item
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      updates,
      { new: true } // return updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Item updated successfully",
      item: updatedItem
    });

  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE ITEM
 const deleteShopItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // 1️⃣ Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 2️⃣ Remove it from shop.items[]
    await Shop.findByIdAndUpdate(item.shopId, {
      $pull: { items: itemId }
    });

    // 3️⃣ Delete item from DB
    await Item.findByIdAndDelete(itemId);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("DELETE ITEM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};





const addShop = async (req, res) => {
  try {
    const { name, ownerName, image, passcode, address, contact } = req.body;

    const shop = new Shop({
      name,
      ownerName,
      image,
      passcode,
      address,
      contact
    });

    await shop.save();

    res.status(201).json({
      message: "Shop added successfully",
      shop
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json({ shops });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};



exports.addShopItem = addShopItem ;
exports.getItemsByShop = getItemsByShop ;
exports.deleteShopItem = deleteShopItem ;
exports.updateShopItem = updateShopItem ;
exports.addShop = addShop ;
exports.getAllShops = getAllShops ;