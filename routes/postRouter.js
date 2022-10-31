const Router = require('express')
const router = new Router()
const postController = require('../controllers/postController')
const authMidlleware = require('../middleware/auth-middleware')

// get all user's posts
router.get('/', authMidlleware, postController.getPostsByUser)

// add post
router.post('/', authMidlleware, postController.addPost)

// delete all user's posts
router.delete('/', authMidlleware, postController.deletePosts)

// delete one user's post
router.delete('/:postId', authMidlleware, postController.deletePost)

module.exports = router
