import ApiError from '../error/ApiError.js'
import { Review, User } from '../models/models.js'

class ReviewService {
    async getReviews(limit, offset) {
        const reviews = Review.findAll({ limit, offset })

        return reviews
    }

    async addReview(userId, apartmentId, rate, description) {
        const review = await Review.create({ userId, apartmentId, rate, description })

        return review
    }

    async editReview(id, body, userId) {
        const review = await Review.findByPk(id)

        if (!userId || !review) {
            throw ApiError.badRequest('User or review not found')
        }

        if (review.userId !== userId) {
            throw ApiError.badRequest('You are not the author of the comment')
        }

        const reviewEdited = await Review.update(body, { where: { id } })

        return reviewEdited
    }

    async deleteReview(id, userId) {
        const review = await Review.findByPk(id)
        const user = await User.findByPk(userId)

        if (!user || !review) {
            throw ApiError.badRequest('User or review not found')
        }

        if (user.role !== 'ADMIN' && review.userId !== userId) {
            throw ApiError.badRequest('You are not allowed to delete this review')
        }

        const deletedReview = await Review.destroy({ where: { id } })

        return deletedReview
    }
}
export default new ReviewService()