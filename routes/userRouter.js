import { Router } from 'express'
import userController from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { body } from 'express-validator'

const router = new Router()

const { register, login, logout, check, getAllUsers, editUser } = userController

router.get('/auth', authMiddleware, check)
router.get('/users', getAllUsers)
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 4, max: 32 }),
    register
)
router.post('/login',
    body('email').isEmail(),
    login
)
router.post('/logout', logout)
router.put('/', editUser)

export default router