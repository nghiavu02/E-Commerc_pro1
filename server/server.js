const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send("alkfjdal")
})

app.listen(port, () => {
    console.log(`server running is the port ${port}`)
})