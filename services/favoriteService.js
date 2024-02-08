import ApiError from '../error/ApiError.js'
import { Apartment, Favorite, User } from '../models/models.js'

class FavoriteService {
    // async getFavorite(userId, limit, offset) {
    //     const favoriteApartments = await Favorite.findAll({
    //         limit,
    //         offset,
    //         where: { userId },
    //         include: [
    //             {
    //                 model: Apartment,
    //                 attributes: ['id', 'title', 'price', 'description', 'photos', 'city', 'category', 'rooms', 'bathrooms', 'area', 'parking']
    //             },
    //             {
    //                 model: User,
    //                 attributes: ['id', 'firstName', 'lastName', 'email', 'photo', 'city', 'role']
    //             }
    //         ]
    //     })
    //     return favoriteApartments
    // }

    async addToFavorite(userId, apartmentId) {
        const user = await User.findByPk(userId)
        const apartment = await Apartment.findByPk(apartmentId)

        if (!user || !apartment) {
            throw ApiError.badRequest('User or apartment not found')
        }

        const isFavoriteExists = await Favorite.findOne({
            where: {
                userId,
                apartmentId
            }
        })

        if (isFavoriteExists) {
            throw ApiError.badRequest('Apartment is already in favorites')
        }

        const favorite = await Favorite.create({
            userId,
            apartmentId
        })

        return favorite
    }

    async removeFromFavorite(userId, apartmentId) {
        const favorite = Favorite.destroy({ where: { userId, apartmentId } })

        return favorite
    }
}

export default new FavoriteService()