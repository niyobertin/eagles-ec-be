import express from 'express'
import * as wishesController from '../controllers/wishesController'
import { isLoggedIn } from '../middlewares/isLoggedIn'
import { isAseller } from '../middlewares/sellerAuth'
import { isAbuyer } from '../middlewares/isAbuyer'

const wishesRouter = express.Router()

wishesRouter.post('/wishes', isLoggedIn, isAbuyer, wishesController.addToWishes)
wishesRouter.get('/wishes', isLoggedIn, wishesController.getUserWishes)
wishesRouter.delete('/products/:id/wishes', isLoggedIn, isAbuyer, wishesController.deleteWish)
wishesRouter.get('/products/:id/wishes', isLoggedIn, isAseller, wishesController.getProductWishes)

export default wishesRouter