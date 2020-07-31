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
            subject: `Berlangganan ${user.provider} Paket ${user.packet} - Seakun.id`,
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

module.exports = router