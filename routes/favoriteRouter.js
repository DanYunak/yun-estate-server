import { Router } from 'express'
import favoriteController from '../controllers/favoriteController.js'

const router = new Router()

const { getFavorite, addToFavorite, removeFromFavorite } = favoriteController

router.get('/', getFavorite)
router.post('/add', addToFavorite)
router.delete('/remove', removeFromFavorite)

export default router