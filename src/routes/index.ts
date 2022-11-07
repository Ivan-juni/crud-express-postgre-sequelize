import Router from 'express'
const router = Router()
import userRouter from './userRouter'
import postRouter from './postRouter'

router.use('/user', userRouter)
router.use('/post', postRouter)

export default router
