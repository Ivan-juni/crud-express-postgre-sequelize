const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const checkRole = require('../middleware/checkRole-middleware')
const { body } = require('express-validator')

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
// router.get('/auth', userController.check)
router.get('/refresh', userController.refresh)

// get all users
router.get('/', checkRole('ADMIN'), userController.getAll)
// get user by id
router.get('/:id', checkRole('ADMIN'), userController.getOne)
// delete user by id
router.delete('/:id', checkRole('ADMIN'), userController.deleteOne)

// !todo change user password
// router.put('/auth/changePassword', userController.changePassword)

module.exports = router
