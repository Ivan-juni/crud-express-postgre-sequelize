import { Request, Response, NextFunction } from 'express'
import ApiError from '../error/ApiError'
import postService from '../service/post-service'

class PostController {
  static async addPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body
      const { id } = req.user
      if (!id) {
        next(ApiError.badRequest('Incorrect user id'))
      }
      const newPost = await postService.createPost(title, content, id)
      res.json(newPost)
    } catch (error) {
      next(error)
    }
  }
  static async getPostsByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user
      if (!id) {
        next(ApiError.badRequest('Incorrect user id'))
      }
      const posts = await postService.getPostsByUser(id)

      res.json(posts)
    } catch (error) {
      next(error)
    }
  }
  static async deletePosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user
      if (!id) {
        next(ApiError.badRequest('Incorrect user id'))
      }
      const posts = await postService.deletePosts(id)

      if (posts !== 0) {
        res.json({ message: 'Posts were deleted' })
      } else {
        res.json({ message: "Posts weren't deleted" })
      }

      res.json(posts)
    } catch (error) {
      next(error)
    }
  }
  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params
      const userId = req.user.id
      if (!userId) {
        next(ApiError.badRequest('Incorrect user id'))
      }
      if (!postId) {
        next(ApiError.badRequest('Incorrect post id'))
      }
      const posts = await postService.deletePost(+postId, userId)

      if (posts === 1) {
        res.json({ message: 'Post was deleted' })
      } else {
        res.json({ message: "Post wasn't deleted" })
      }
    } catch (error) {
      next(error)
    }
  }
}

export default PostController
