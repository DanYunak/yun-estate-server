import { Router } from 'express'
import apartmentRouter from './apartmentRouter.js'
import userRouter from './userRouter.js'
import favoriteRouter from './favoriteRouter.js'
import reviewRouter from './reviewRouter.js'

const router = new Router()

router.use('/user', userRouter)
router.use('/apartments', apartmentRouter)
router.use('/favorite', favoriteRouter)
router.use('/reviews', reviewRouter)


export default router