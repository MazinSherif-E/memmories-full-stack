const express = require('express')
const { signin, signup, me, logout, token } = require('../controllers/user')
const auth = require('../middleware/auth')

const router = express.Router();

router.post('/signin', signin)
router.post('/signup', signup)
router.get('/me', auth, me)
router.post('/logout', auth, logout)
module.exports = router;
