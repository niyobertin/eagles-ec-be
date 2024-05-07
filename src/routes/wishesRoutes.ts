import express from 'express'
import * as wishesController from '../controllers/wishesController'
import { isLoggedIn } from '../middlewares/isLoggedIn'
import { isAseller } from '../middlewares/sellerAuth'
import { isAbuyer } from '../middlewares/isAbuyer'

const wishesRouter = express.Router()

wishesRouter.post('/', isLoggedIn, isAbuyer, wishesController.addToWishes)
wishesRouter.get('/', isLoggedIn, isAbuyer, wishesController.getUserWishes)
wishesRouter.delete('/:id', isLoggedIn, isAbuyer, wishesController.deleteWish)
wishesRouter.get('/:id', isLoggedIn, isAseller, wishesController.getProductWishes)

export default wishesRouter