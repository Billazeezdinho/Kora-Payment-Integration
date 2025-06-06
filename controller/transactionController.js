const {transactionModel} = require('../models/transactionModel');
const axios = require('axios')
const otpGenerator = require('otp-generator');
const { message } = require('statuses');
const otp = otpGenerator.generate(12, {specialChars: false})
const ref =  `TCA-AF-${otp}`;
const secret_key = process.env.korapay_secret_key
const formattedDate = new Date().toLocaleString()

exports.initializePayment = async (req, res) =>{
    try {
        const { email, name, amount } = req.body;
        if(!email || !amount || !name){
            return res.status(400).json({
                message: 'Please input all field'
            })
        };
        const paymentData = {
            amount,
            customer:{
                name,
                email
            },
            currency: 'NGN',
            reference: ref
        };
        console.log( 'Before Payment' )
        const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize',paymentData, {
            headers: {
                Authorization: `Bearer ${secret_key}`
            }
        });
        console.log( 'After Payment' )
        
        const { data } = response?.data;
        const payment = new transactionModel({
            name,
            email,
            amount,
            reference:paymentData.reference,
            paymentDate: formattedDate
        })
        await payment.save();

        res.status(200).json({
            message:' payment initialize Successfully',
            data:{
                reference: data?.reference,
                checkout_url: data?.checkout_url
            }
        })
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: ' Internal server error'
        })
        
    }
}

exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;
        const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,{
            headers: { Authorization: ` Bearer ${secret_key}`}
        });
        const { data } = response?.data;

        if(data?.status && data?.status === 'success' ){
            const payment = await transactionModel.findOneAndUpdate({reference}, {status: 'success'}, {new:true});
            res.status(200).json({
                message: 'Payment Verification Successfully',
                data: payment
            })
        }else{
            const payment = await transactionModel.findOneAndUpdate({reference}, {status: 'failed'}, {new:true});
            res.status(200).json({
                message: 'Payment Verification Failed',
                data: payment
            })

        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error' + error.message
        })
        
    }
}

exports.getAllTransaction = async (req, res) => {
    try {

        const trans = await transactionModel.find({ })
        if(!trans){
            return res.status(404).json({
                message: 'No Transaction Found'
            })
        }
        if(trans.length <= 0){
            return res.status(404).json({
                message: 'No Transaction fOUND'
            })
        }
        res.status(200).josn({
            message: 'successfully fetch List of Transaction',
            data: trans
        })
    } catch (error) {
        res.status(500).json({
            message: 'internal server error' + error.message
        })
    }
}