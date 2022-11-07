import Router from 'express'
const router = Router()
import postController from '../controllers/postController'
import authMidlleware from '../middleware/auth-middleware'

// get all user's posts
router.get('/', authMidlleware, postController.getPostsByUser)

// add post
router.post('/', authMidlleware, postController.addPost)

// delete all user's posts
router.delete('/', authMidlleware, postController.deletePosts)

// delete one user's post
router.delete('/:postId', authMidlleware, postController.deletePost)

export default router
