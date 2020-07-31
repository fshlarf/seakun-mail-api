require('dotenv').config()
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

transporter.use('compile', hbs({
    viewEngine:{
        partialsDir:"views",
        defaultLayout:""
    },
    viewPath:"views",
    extName:".hbs"
}))

module.exports = transporter