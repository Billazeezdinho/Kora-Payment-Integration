const { initializePayment } = require('../controller/transactionController');

const router = require('express').Router()

router.post('/initialize', initializePayment)

module.exports = router;