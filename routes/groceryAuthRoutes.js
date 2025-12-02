const express = require('express') ;

const { groceryShopLogin } = require('../controllers/groceryAuthController') ;

const router = express.Router() ;

router.post('/groceryShopLogin', groceryShopLogin) ;

module.exports = router ;