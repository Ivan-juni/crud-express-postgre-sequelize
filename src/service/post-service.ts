import ApiError from '../error/ApiError'
import { Post } from '../models/models'

class PostService {
  static async createPost(title: string, content: string, userId: number) {
    const newPost = await Post.create({
      title: title,
      content: content,
      userId,
    })
    return newPost
  }
  static async getPostsByUser(userId: number) {
    const posts = await Post.findAll({ where: { userId } })

    return posts
  }
  static async deletePosts(userId: number) {
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
  static async deletePost(postId: number, userId: number) {
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

export default PostService
