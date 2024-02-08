import { Router } from 'express'
import reviewController from '../controllers/reviewController.js'
import { body } from 'express-validator'

const router = new Router()

const { getReviews, addReview, editReview, deleteReview } = reviewController

router.get('/', getReviews)
router.post('/add',
    body('description').isLength({ min: 2 }),
    addReview
)
router.put('/edit',
    body('description').isLength({ min: 2 }),
    editReview
)
router.delete('/delete', deleteReview)

export default router