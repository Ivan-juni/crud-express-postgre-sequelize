const ApiError = require('../error/ApiError')
const { Post } = require('../models/models')

class PostController {
  async createPost(req, res, next) {
    try {
      const { title, content, id } = req.body
      if (!id) {
        next(ApiError.badRequest("User id wasn't typed"))
      }
      const newPost = await Post.create({
        title: title,
        content: content,
        id: id,
      })
      res.json(newPost)
    } catch (error) {
      next(error)
    }
  }
  async getPostsByUser(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        next(ApiError.badRequest("User id wasn't typed"))
      }
      const posts = await Post.findAll({ where: { id: id } })

      res.json(posts)
    } catch (error) {
      next(error)
    }
  }
  async deletePosts(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        next(ApiError.badRequest("User id wasn't typed"))
      }
      const posts = await Post.destroy({
        where: {
          id: id,
        },
      })

      res.json(posts)
    } catch (error) {
      next(error)
    }
  }
  async deletePost(req, res, next) {
    try {
      const { postId, userId } = req.params
      if (!userId) {
        next(ApiError.badRequest("User id wasn't typed"))
      }
      if (!postId) {
        next(ApiError.badRequest("Post id wasn't typed"))
      }
      const posts = await Post.destroy({
        where: {
          id: userId,
        },
      })

      res.json(posts)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new PostController()
