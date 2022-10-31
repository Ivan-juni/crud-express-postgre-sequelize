const ApiError = require('../error/ApiError')
const postService = require('../service/post-service')

class PostController {
  async addPost(req, res, next) {
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
  async getPostsByUser(req, res, next) {
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
  async deletePosts(req, res, next) {
    try {
      const { id } = req.user
      if (!id) {
        next(ApiError.badRequest('Incorrect user id'))
      }
      const posts = await postService.deletePosts(id)

      res.json(posts)
    } catch (error) {
      next(error)
    }
  }
  async deletePost(req, res, next) {
    try {
      const { postId } = req.params
      const userId = req.user.id
      if (!userId) {
        next(ApiError.badRequest('Incorrect user id'))
      }
      if (!postId) {
        next(ApiError.badRequest('Incorrect post id'))
      }
      const posts = await postService.deletePost(postId, userId)

      res.json(posts)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new PostController()
