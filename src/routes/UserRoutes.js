const { Router } = require('express');

const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

const jsonwebtoken = require('../libs/jsonwebtoken');

const router = Router();

router.post('/auth/register', AuthController.register);

router.post('/auth/login', AuthController.login);

router.get('/user/:id', jsonwebtoken.ValidateToken ,UserController.getUser);

router.get('/users', jsonwebtoken.ValidateToken, UserController.getAllUsers);

router.put('/user/:id/add-card', jsonwebtoken.ValidateToken, UserController.addCard);

router.put('/user/:id/add-contact', jsonwebtoken.ValidateToken, UserController.addContact);

router.put('/user/:id/delete-contact', jsonwebtoken.ValidateToken, UserController.deleteContact);

module.exports = router;