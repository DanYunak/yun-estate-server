import ApiError from '../error/ApiError.js'
import { Apartment, Review, User } from '../models/models.js'
import reviewService from '../services/reviewService.js'
import { validationResult } from 'express-validator'

class ReviewController {
    async getReviews(req, res, next) {
        let { limit, page } = req.query

        page = page || 1
        limit = limit || 10

        let offset = page * limit - limit

        const reviews = await reviewService.getReviews(limit, offset)

        return res.json(reviews)
    }

    async addReview(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Your review is too small'))
            }

            const { userId, apartmentId, rate, description } = req.body

            const user = await User.findByPk(userId)
            const apartment = await Apartment.findByPk(apartmentId)

            if (!user || !apartment) {
                throw ApiError.badRequest('User or apartment not found')
            }

            const review = await reviewService.addReview(userId, apartmentId, rate, description)

            return res.json(review)
        } catch (e) {
            next(e)
        }
    }

    async editReview(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Your review is too small'))
            }

            const { id, userId } = req.body

            await reviewService.editReview(id, req.body, userId)

            return res.status(200).json({ message: 'The review was edited' })
        } catch (e) {
            next(e)
        }
    }

    async deleteReview(req, res, next) {
        try {
            const { id, userId } = req.body

            await reviewService.deleteReview(id, userId)

            return res.status(200).json({ message: 'Review was successfully deleted' })
        } catch (e) {
            next(e)
        }
    }
}

export default new ReviewController()