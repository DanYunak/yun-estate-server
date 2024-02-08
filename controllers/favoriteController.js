import ApiError from '../error/ApiError.js'
import { Apartment, Favorite, User } from '../models/models.js'
import favoriteService from '../services/favoriteService.js'

class FavoriteController {
    async getFavorite(req, res, next) {
        try {
            let { userId, limit, page } = req.query

            page = page || 1
            limit = limit || 7

            if (!userId) {
                throw ApiError.badRequest('User not found')
            }

            let offset = page * limit - limit

            const favoriteApartments = await Favorite.findAll({
                limit,
                offset,
                where: { userId },
                include: [
                    {
                        model: Apartment,
                        attributes: ['id', 'title', 'price', 'description', 'photos', 'city', 'category', 'rooms', 'bathrooms', 'area', 'parking']
                    },
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'email', 'photo', 'city', 'role']
                    }
                ]
            })

            return res.json(favoriteApartments)
        } catch (e) {
            next(e)
        }
    }

    async addToFavorite(req, res, next) {
        try {
            const { userId, apartmentId } = req.body

            const favorite = await favoriteService.addToFavorite(userId, apartmentId)

            return res.json(favorite)
        } catch (e) {
            next(e)
        }
    }

    async removeFromFavorite(req, res, next) {
        try {
            const { userId, apartmentId } = req.body

            if (!userId || !apartmentId) {
                throw ApiError.badRequest('User or apartment not found')
            }

            await favoriteService.removeFromFavorite(userId, apartmentId)

            return res.status(200).json({ message: 'Apartment was successfully removed from favorite' })
        } catch (e) {
            next(e)
        }
    }
}

export default new FavoriteController()