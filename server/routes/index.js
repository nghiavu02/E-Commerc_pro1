const userRouter = require('./user')
const productRouter = require('./product')

const { notFound, errHandler } = require('../middlewares/erroHandler')

const route = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)

    app.use(notFound)
    app.use(errHandler)
}

module.exports = route