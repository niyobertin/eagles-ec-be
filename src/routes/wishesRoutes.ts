import express from 'express'
import * as wishesController from '../controllers/wishesController'
import { isLoggedIn } from '../middlewares/isLoggedIn'
import { isAseller } from '../middlewares/sellerAuth'
import { isAbuyer } from '../middlewares/isAbuyer'
import { isPasswordOutOfDate } from '../middlewares/isPasswordOutOfDate'

const wishesRouter = express.Router()

wishesRouter.post('/wishes', isLoggedIn,isPasswordOutOfDate,isAbuyer, wishesController.addToWishes)
wishesRouter.get('/wishes', isLoggedIn,isPasswordOutOfDate, wishesController.getUserWishes)
wishesRouter.delete('/products/:id/wishes', isLoggedIn,isPasswordOutOfDate, isAbuyer, wishesController.deleteWish)
wishesRouter.get('/products/:id/wishes', isLoggedIn,isPasswordOutOfDate, isAseller, wishesController.getProductWishes)

export default wishesRouter