const ApiError = require('../error/ApiError')
const { Post } = require('../models/models')

class PostService {
  async createPost(title, content, userId) {
    const newPost = await Post.create({
      title: title,
      content: content,
      userId,
    })
    return newPost
  }
  async getPostsByUser(userId) {
    const posts = await Post.findAll({ where: { userId } })

    return posts
  }
  async deletePosts(userId) {
    if (!userId) {
      throw ApiError.badRequest(`Incorrect user id`)
    }
    const posts = await Post.destroy({
      where: {
        userId,
      },
    })

    return posts
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
        id: postId,
        userId,
      },
    })

    return posts
  }
}

module.exports = new PostService()
