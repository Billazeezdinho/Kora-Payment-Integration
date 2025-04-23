const { initializePayment, verifyPayment } = require('../controller/transactionController');

const router = require('express').Router()

router.post('/api/initializePayment/', initializePayment)

router.get('/verify', verifyPayment)

module.exports = router;    