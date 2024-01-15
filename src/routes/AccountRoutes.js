const {Router} = require("express");

const AccountController = require("../controllers/AccountController");
const jsonwebtoken = require("../libs/jsonwebtoken");


const router = Router();

//add money to account
router.put("/account/:id", jsonwebtoken.ValidateToken, AccountController.addMoney);

//withdraw money from account
router.put("/account/withdraw/:id", jsonwebtoken.ValidateToken, AccountController.withdrawMoney);

//transfer money from account to account
router.put("/account/transfer/:id", jsonwebtoken.ValidateToken, AccountController.transferMoney);


module.exports = router;