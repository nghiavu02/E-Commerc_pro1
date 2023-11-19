const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 8888
const db = require('./config/dbconnect')
const route = require('./routes')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
db.connect()
route(app)


app.listen(port, () => {
    console.log(`server running on the port ${port}`)
})