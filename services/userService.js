import UserDto from '../dtos/userDto.js'
import { User, Favorite, Token } from '../models/models.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import ApiError from '../error/ApiError.js'
import bcrypt from 'bcrypt'
import tokenService from './tokenService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateAndSaveTokens(user) {
    const tokens = tokenService.generateTokens({ ...user })
    await tokenService.saveToken(user.id, tokens.refreshToken)

    return tokens
}

class UserService {
    async register(firstName, lastName, email, password, photo, city, role) {
        let fileName

        if (photo) {
            fileName = uuidv4() + '.jpg'
            const filePath = path.resolve(__dirname, '..', 'static', fileName)

            await new Promise((resolve, reject) => {
                photo.mv(filePath, (error) => {
                    if (error) {
                        reject(ApiError.internal('Failed to save photo', error))
                    } else {
                        resolve(fileName)
                    }
                })
            })
        }

        const candidate = await User.findOne({ where: { email } })

        if (candidate) {
            throw ApiError.badRequest('A user with this email already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 5)
        const user = await User.create({
            firstName,
            lastName,
            email,
            photo: fileName,
            city,
            role,
            password: hashedPassword
        })

        const wishList = await Favorite.create({ userId: user.id })

        const userDto = new UserDto(user)

        const generatedTokens = await generateAndSaveTokens(userDto)

        return { ...generatedTokens, user: userDto }
    }
    async login(email, password) {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            throw ApiError.badRequest('User with this email not found')
        }

        let comparePassword = bcrypt.compareSync(password, user.password)

        if (!comparePassword) {
            throw ApiError.badRequest('Incorrect password')
        }

        const userDto = new UserDto(user)

        const generatedTokens = await generateAndSaveTokens(userDto)

        return { ...generatedTokens, user: userDto }
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)

        return token
    }

    async editUser(id, photo, body) {
        let fileName

        if (photo) {
            fileName = uuidv4() + '.jpg'
            const filePath = path.resolve(__dirname, '..', 'static', fileName)

            await new Promise((resolve, reject) => {
                photo.mv(filePath, (error) => {
                    if (error) {
                        reject(ApiError.internal('Failed to save photo'))
                    } else {
                        resolve(fileName)
                    }
                })
            })
        }

        const user = await User.update({ ...body, photo: fileName }, { where: { id } })

        return user
    }

    async getAllUsers() {
        const users = await User.findAll()

        return users
    }
}

export default new UserService()