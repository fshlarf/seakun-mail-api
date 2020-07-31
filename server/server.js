const express = require('express')
const apiRouter = require('./routes')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

app.use('/', apiRouter)

app.listen(process.env.PORT || '4001', () => {
    console.log(`Server is running on port: ${process.env.PORT || '4001'}`);
})