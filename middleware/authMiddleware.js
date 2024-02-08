import jsonwebtoken from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer ewrjfocme

        if (!token) {
            return res.status(401).json({ message: 'You are not authorized' })
        }

        const decoded = jsonwebtoken.verify(token, process.env.ACCESS_SECRET)
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({ message: 'You are not authorized' })
    }
}