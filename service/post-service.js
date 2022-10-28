const ApiError = require('../error/ApiError')
const { Post } = require('../models/models')

class PostService {
  async createPost(title, content, id) {
    if (!id) {
      throw ApiError.badRequest(`Введите id пользователя`)
    }
    const newPost = await Post.create({
      title: title,
      content: content,
      id: id,
    })
    res.json(newPost)
  }
  async getPostsByUser(postId) {
    if (!postId) {
      throw ApiError.badRequest(`Введите id пользователя`)
    }
    const posts = await Post.findAll({ where: { id: postId } })

    res.json(posts)
  }
  async deletePosts(postId) {
    if (!postId) {
      throw ApiError.badRequest(`Введите id пользователя`)
    }
    const posts = await Post.destroy({
      where: {
        id: postId,
      },
    })

    res.json(posts)
  }
  async deletePost(postId, userId) {
    if (!userId) {
      throw ApiError.badRequest(`Введите id пользователя`)
    }
    if (!postId) {
      throw ApiError.badRequest(`Введите id поста`)
    }
    const posts = await Post.destroy({
      where: {
        id: userId,
      },
    })

    res.json(posts)
  }
}

module.exports = new PostService()
