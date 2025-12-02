const Shop = require('../models/shop') ;
const jwt = require('jsonwebtoken') ;
const bcrypt = require("bcryptjs");

const groceryShopLogin = async (req, res) =>{
    console.log("Grocery Shop Login Attempt", req.body) ;
     const {shopName, passcode} = req.body ;

     try{
        const shop =  await Shop.findOne({name:shopName}) ;
        if(!shop){
            return res.status(400).json({message: "Shop not found"}) ;
        }
        if(passcode !== shop.passcode){
            return res.status(400).json({message: "Invalid passcode"}) ;
        }
        const token = jwt.sign({id: shop._id, shopName: shop.name}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'}) ;
        await shop.populate("items") ;
        return res.json({token, shop }) ;
     }
        catch(err){
        res.status(500).json({message: err.message}) ;
    }
} 

exports.groceryShopLogin = groceryShopLogin ;