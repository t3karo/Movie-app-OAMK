import { Router } from 'express'
import { deleteAccount, postLogin, postRegistration } from '../controllers/UserController.js'
import { authenticate } from '../middleware/AuthMiddleware.js'

const router = Router()

router.post('/register', postRegistration)
router.post('/login', postLogin)
router.delete('/delete-account', authenticate, deleteAccount);

export { router}