const express = require('express');
const { register,
    login,
    getMe,
    logout,
    forgetPassword,
    resetPassword,
    updateDetails,
    updatePassword } = require('../controllers/auth');

const router = express.Router();
const { protect } = require('../middleware/auth');


router
    .post('/register', register)
    .post('/login', login)
    .get('/me', protect, getMe)
    .get('/logout', logout)
    .put('/updatedetails', protect, updateDetails)
    .put('/updatepassword', protect, updatePassword)
    .post('/forgetpassword', forgetPassword)
    .put('/resetpassword/:resettoken', resetPassword);
    


module.exports = router;
