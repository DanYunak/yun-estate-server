import { dirname } from 'path'
import { fileURLToPath } from 'url'
import ApiError from '../error/ApiError.js'
import userService from '../services/userService.js'
import { validationResult } from 'express-validator'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class UserController {
    async check(req, res, next) {
        const token = generateJWT(req.user.id, req.user.email, req.user.role)

        res.json({ token })
    }

    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Validation error', errors.array()))
            }

            const { firstName, lastName, email, password, city, role } = req.body
            const photo = req.files && req.files.photo

            if (!email || !password) {
                return next(ApiError.badRequest('Incorrect email or password'))
            }

            const user = await userService.register(firstName, lastName, email, password, photo, city, role)

            res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('The format of the email address is not correct', errors.array()))
            }

            const { email, password } = req.body

            const user = await userService.login(email, password)

            res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies

            await userService.logout(refreshToken)

            res.clearCookie('refreshToken')

            return res.status(200).json({ message: 'You have successfully logged out' })
        } catch (e) {
            next(e)
        }
    }


    async editUser(req, res, next) {
        try {
            const { id } = req.body
            const photo = req.files && req.files.photo

            if (!id) {
                throw ApiError.badRequest('ID is not defined')
            }

            await userService.editUser(id, photo, req.body)

            return res.status(200).json({ message: 'User was successfully edited' })
        } catch (e) {
            next(e)
        }
    }

    async getAllUsers(req, res, next) {
        const users = await userService.getAllUsers()

        return res.json(users)
    }
}

export default new UserController()