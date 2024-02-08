import { Apartment } from '../models/models.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class ApartmentService {
    async getApartments(limit, offset) {
        const apartments = await Apartment.findAll({ limit, offset })

        return apartments
    }

    async getApartment(id) {
        const apartment = await Apartment.findOne({ where: { id } })

        return apartment
    }

    async addApartment(title, price, description, photos, city, category, rooms, bedrooms, bathrooms, area, parking) {
        const photoArray = photos.map(photo => {
            const fileName = uuidv4() + '.jpg'
            const filePath = path.resolve(__dirname, '..', 'static', fileName)
            photo.mv(filePath)
            return fileName
        })

        const apartment = await Apartment.create({
            title,
            price,
            description,
            photos: photoArray,
            city,
            category,
            rooms,
            bedrooms,
            bathrooms,
            area,
            parking
        })

        return apartment
    }

    async editApartment(id, body, photos) {
        const photoArray = photos.map(photo => {
            const fileName = uuidv4() + '.jpg'
            const filePath = path.resolve(__dirname, '..', 'static', fileName)
            photo.mv(filePath)
            return fileName
        })

        const apartment = await Apartment.update({ ...body, photos: photoArray }, { where: { id } })

        return apartment
    }

    async deleteApartment(id) {
        const apartment = await Apartment.destroy({ where: { id } })

        return apartment
    }
}

export default new ApartmentService()