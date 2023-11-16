const userRouter = require('./user')
const { notFound, errHandler } = require('../middlewares/erroHandler')
const route = (app) => {
    app.use('/api/user', userRouter)


    app.use(notFound)
    app.use(errHandler)
}

module.exports = route