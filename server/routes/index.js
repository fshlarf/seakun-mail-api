const express = require('express')
const transporter = require('../mail')
const referalUsersData = [
    {   
        referal_code: 'anakusu',
        name: 'Anak USU',
        email: 'faishal1303@gmail.com',
        date_agreement: '14 September 2020',
        date_cashing: '14 September 2020',
        profit: 'Rp1.000'
    },
    {
        referal_code: 'israsyafira',
        name: 'Isra Syafira',
        email: 'faishal1303@gmail.com',
        date_agreement: '14 September 2020',
        date_cashing: '14 September 2020',
        profit: 'Rp1.000'
    }
]

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
            template: 'registered-user',
            context: {
                fullname: user.fullname,
                packet: user.packet,
                provider: user.provider,
                voucher: user.voucher,
                price: `Rp${user.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
                discountprice: `Rp${user.discountprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`,
            }
        }
        sendMail(mailOptions)
        res.send(user)
    }
})

const sendMailReferalCode = (dataBody) => {
    dataBody && referalUsersData.map(e => {
        if (e.referal_code == dataBody.referal_code) {
            let mailOptions = {
                referal_code: dataBody.referal_code,
                from: `${process.env.NAME} ${process.env.EMAIL}`,
                to: e.email,
                cc: process.env.EMAILCC,
                subject: `User Baru Referal dari ${e.name} - Seakun.id`,
                template: 'referal-code',
                context: {
                    name: dataBody.name,
                    referal_name: e.name,
                    packet: dataBody.packet,
                    provider: dataBody.provider,
                    profit: e.profit,
                    date_cashing: e.date_cashing,
                    referal_code: dataBody.referal_code
                }
            }
            sendMail(mailOptions)
        }
    })
}

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
        if (dataBody.referal_code) sendMailReferalCode(dataBody)
        res.send(dataBody)
    }
})

router.post('/billing', (req, res, next) => {
    let dataBody = req.body
    if (req) {
        let mailOptions = {
            from: `${process.env.NAME} ${process.env.EMAIL}`,
            to: dataBody.email,
            cc: process.env.EMAILCC,
            subject: `Reminder Tagihan Bulanan ${dataBody.packet} ${dataBody.provider} - Seakun.id`,
            template: 'netflix-billing-monthly',
            context: {
                fullname: dataBody.fullname,
                provider: dataBody.provider,
                packet: dataBody.packet,
                price: dataBody.price,
                last_active_date: dataBody.last_active_date,
            }
        }
        sendMail(mailOptions)
        res.send(dataBody)
    }
})

module.exports = router