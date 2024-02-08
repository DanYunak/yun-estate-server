import { Router } from 'express'
import apartmentController from '../controllers/apartmentController.js'
import { checkRoleMiddleware } from '../middleware/checkRoleMiddleware.js'
import { body } from 'express-validator'

const router = new Router()

const { getApartments, getApartment, addApartment, editApartment, deleteApartment } = apartmentController

router.get('/', getApartments)
router.get('/:id', getApartment)
router.post('/apartment',
    body('title').isLength({ min: 2, max: 50 }),
    addApartment
)
router.put('/apartment',
    body('title').isLength({ min: 2, max: 50 }),
    editApartment
)
router.delete('/apartment/:id', deleteApartment)
// router.post('/apartment', checkRoleMiddleware('ADMIN'), addApartment)
// router.put('/apartment', checkRoleMiddleware('ADMIN'), editApartment)
// router.delete('/apartment', checkRoleMiddleware('ADMIN'), deleteApartment)

export default router