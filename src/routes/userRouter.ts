import Router from 'express'
const router = Router()
import userController from '../controllers/userController'
import checkRole from '../middleware/checkRole-middleware'
import { body } from 'express-validator'

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 32 }),
  userController.registration
)
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userController.login
)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)

// get all users
router.get('/', checkRole('ADMIN'), userController.getAll)
// get user by id
router.get('/:id', checkRole('ADMIN'), userController.getOne)
// delete user by id
router.delete('/:id', checkRole('ADMIN'), userController.deleteOne)

// !todo change user password
// router.put('/auth/changePassword', userController.changePassword)

export default router
