const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
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
router.get('/auth', userController.check)
router.get('/refresh', userController.refresh)

// get all users
router.get('/', userController.getAll)
// get user by id
router.get('/:id', userController.getOne)
// delete user by id
router.delete('/:id', userController.deleteOne)

// !todo change user password
// router.put('/auth/changePassword', userController.changePassword)

module.exports = router
