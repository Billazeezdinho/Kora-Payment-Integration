require('dotenv').config()
const mongoose = require('mongoose')
const DATABASE = process.env.DATABASE_URL
mongoose.connect(DATABASE).then(()=>{
    console.log(`DATABASE CONNECTED SUCCESSFULLY`)
}).catch((error)=>{
    console.log('Unable to connect to database' + error.message)
    
});