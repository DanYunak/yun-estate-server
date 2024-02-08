import { dirname } from 'path'
import { fileURLToPath } from 'url'
import ApiError from '../error/ApiError.js'
import apartmentService from '../services/apartmentService.js'
import { validationResult } from 'express-validator'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class ApartmentController {
    async getApartments(req, res, next) {
        let { limit, page } = req.query

        page = page || 1
        limit = limit || 7

        let offset = page * limit - limit

        const apartments = await apartmentService.getApartments(limit, offset)

        return res.json(apartments)
    }

    async getApartment(req, res, next) {
        try {
            const { id } = req.params
            const apartment = await apartmentService.getApartment(id)
            return res.json(apartment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addApartment(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Title validation error'))
            }

            const { title, price, description, city, category, rooms, bedrooms, bathrooms, area, parking } = req.body
            const { photos } = req.files

            const apartment = await apartmentService.addApartment(
                title,
                price,
                description,
                photos,
                city,
                category,
                rooms,
                bedrooms,
                bathrooms,
                area,
                parking
            )

            return res.json(apartment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async editApartment(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Title validation error'))
            }

            const { id } = req.body
            const { photos } = req.files

            if (!id) {
                throw ApiError.badRequest('ID is not defined')
            }

            await apartmentService.editApartment(id, req.body, photos)

            return res.status(200).json({ message: 'Apartment was successfully edited' })
        } catch (e) {
            next(e)
        }
    }

    async deleteApartment(req, res, next) {
        try {
            const { id } = req.params

            if (!id) {
                throw ApiError.badRequest('ID is not defined')
            }

            await apartmentService.deleteApartment(id)

            return res.status(200).json({ message: 'Apartment was successfully deleted' })
        } catch (e) {
            next(e)
        }
    }
}

export default new ApartmentController()