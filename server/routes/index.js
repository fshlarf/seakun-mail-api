const express = require('express')
const transporter = require('../mail')

const router = express.Router()

const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('Error Occurs: ', err);
        } else {
            console.log('Email Sent');
        }
    })
}

router.get('/', (req, res, next) => {
    res.send('Already running mail seakun.id')
})

router.post('/', (req, res, next) => {
    let user = req.body
    if (req) {
        let mailOptions = {
            from: `${process.env.NAME} ${process.env.EMAIL}`,
            to: user.email,
            cc: process.env.EMAILCC,
            subject: `Berlangganan ${user.provider} ${user.packet} - Seakun.id`,
            template: 'registered-netflix',
            context: {
                fullname: user.fullname,
                packet: user.packet,
                price: `Rp ${user.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
            }
        }
        sendMail(mailOptions)
        res.send(user)
    }
})

router.post('/created-account', (req, res, next) => {
    let dataBody = req.body
    if (req) {
        let mailOptions = {
            from: `${process.env.NAME} ${process.env.EMAIL}`,
            to: dataBody.email,
            cc: process.env.EMAILCC,
            subject: `Akun ${dataBody.provider} ${dataBody.packet} - Seakun.id`,
            template: 'created-netflix-account',
            context: {
                name: dataBody.name,
                provider: dataBody.provider,
                packet: dataBody.packet,
                username: dataBody.username,
                password: dataBody.password,
                pin: dataBody.pin,
                billing_date: dataBody.billing_date
            }
        }
        sendMail(mailOptions)
        res.send(dataBody)
    }
})

module.exports = router