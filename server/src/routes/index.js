const express = require('express')
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const bookRouter = require('./book.router')
const categoryRouter = require('./category.router')
const recordRouter = require('./record.router')
const roleRouter = require('./role.router')
const router = express.Router()
const { authMiddleware } = require('../middlewares')
const profileRouter = require('./profile.router')
const { ROLE_TYPES } = require('../constant')

router.use('/auth', authRouter)
router.use(
  '/user',
  authMiddleware.verify,
  authMiddleware.checkRole([ROLE_TYPES.ADMIN, ROLE_TYPES.LIBRARIAN]),
  userRouter
)
router.use('/book', authMiddleware.verify, bookRouter)
router.use('/category', authMiddleware.verify, categoryRouter)
router.use('/record', authMiddleware.verify, recordRouter)
router.use(
  '/role',
  authMiddleware.verify,
  authMiddleware.checkRole([ROLE_TYPES.ADMIN]),
  roleRouter
)
router.use('/profile', authMiddleware.verify, profileRouter)

module.exports = router
