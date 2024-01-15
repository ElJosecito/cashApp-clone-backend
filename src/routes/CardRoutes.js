const { Router } = require('express');

const CardController = require('../controllers/CardController');

const jsonwebtoken = require('../libs/jsonwebtoken');

const router = Router();

//withdraw money from card

router.put('/card/withdraw/:id', jsonwebtoken.ValidateToken, CardController.payWithCard);


module.exports = router;