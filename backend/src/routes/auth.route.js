import express from 'express';
import { login, logout, signup, updateProfile ,checkAuth} from '../controllers/auth.controller.js';
import protectRoute from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/signup', signup);

router.post("/login", login);

router.post('/logout', logout)


// in order to update profile we will create a middleware "Protected Route" to authenticate the user so we first make protectRoute function then we will go to updatePr0file 

router.put('/update-profile', protectRoute, updateProfile);

// create a fucntion "checkAuth" to cehck if user is authenticated or NOT

router.get('/check', protectRoute, checkAuth);

export default router;