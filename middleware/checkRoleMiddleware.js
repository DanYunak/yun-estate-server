import jsonwebtoken from 'jsonwebtoken'

export function checkRoleMiddleware(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer ewrjfocme

            if (!token) {
                res.status(401).json({ message: 'You are not authorized' })
            }

            const decoded = jsonwebtoken.verify(token, process.env.ACCESS_SECRET)
            if (decoded.role !== role) {
                return res.status(403).json({ message: 'No access' })
            }
            req.user = decoded
            next()
        } catch (e) {
            res.status(401).json({ message: 'You are not authorized' })
        }
    }
}