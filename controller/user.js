// const UserModel = require('../models/user')
// const nodemailer = require('nodemailer')
// const jwt = require('jsonwebtoken');

// module.exports.signup = (req, res) => {
//     console.log(req.body)

//     // email should not exist alreday

//     const newUser = new UserModel({
//         email: req.body.email,
//         password: req.body.password,
//         name: req.body.name,
//         phone_no: req.body.phone_no,
//         address: req.body.address
//     });

//     newUser.save().then(() => {
//         res.send({ code: 200, message: 'Signup success' })
//     }).catch((err) => {
//         res.send({ code: 500, message: 'Signup Err' })
//     })
//     const token = jwt.sign({ userId: newUser._id }, '123123123');
//     res.json({ code: 200, message: 'Signup success', token });
// }

// module.exports.signin = async (req, res) => {
//     try {
//         console.log(req.body.email);

//         // email and password match
//         const result = await UserModel.findOne({ email: req.body.email });

//         console.log(result, '11');

//         // match password with req.body.password
//         if (result.password !== req.body.password) {
//             res.status(404).json({ code: 404, message: 'password wrong' });
//         } else {
//             const token = jwt.sign({ userId: result._id }, 'your-secret-key');
//             res.json({ email: result.email, code: 200, message: 'user Found', token });
//         }
//     } catch (error) {
//         console.error('Error during signin:', error);
//         res.status(500).json({ code: 500, message: 'Server err' });
//     }
// };

// module.exports.sendotp = async (req, res) => {
//     console.log(req.body)
//     const _otp = Math.floor(100000 + Math.random() * 900000)
//     console.log(_otp)
//     let user = await UserModel.findOne({ email: req.body.email })
//     // send to user mail
//     if (!user) {
//         res.send({ code: 500, message: 'user not found' })
//     }

//     let testAccount = await nodemailer.createTestAccount()

//     let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false,
//         auth: {
//             user: testAccount.user,
//             pass: testAccount.pass
//         }
//     })



//     let info = await transporter.sendMail({
//         from: 'alleonardballesteros@gmail.com',
//         to: req.body.email, // list of receivers
//         subject: "OTP", // Subject line
//         text: String(_otp),
//         html: `<html>
//             < body >
//             Hello and welcome
//         </ >
//        </html > `,
//     })

//     if (info.messageId) {

//         console.log(info, 84)
//         UserModel.updateOne({ email: req.body.email }, { otp: _otp })
//         .then(result => {
//             res.send({ code: 200, message: 'otp send', otp: _otp }); // Include OTP in the response
//         })
//         .catch(err => {
//             res.send({ code: 500, message: 'Server err' });
//         });

//     } else {
//         res.send({ code: 500, message: 'Server err' })
//     }
// }


// module.exports.submitotp = (req, res) => {
//     console.log(req.body)


//     UserModel.findOne({ otp: req.body.otp }).then(result => {

//         //  update the password 

//         UserModel.updateOne({ email: result.email }, { password: req.body.password })
//             .then(result => {
//                 res.send({ code: 200, message: 'Password updated' })
//             })
//             .catch(err => {
//                 res.send({ code: 500, message: 'Server err' })

//             })


//     }).catch(err => {
//         res.send({ code: 500, message: 'otp is wrong' })

//     })


// }