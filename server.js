const express = require('express');
require('./config/database')

const transactionRouter = require('./routes/transactionRouter');



const PORT = 8550;
const app = express()

app.use(express.json())
app.use('/api/v1', transactionRouter)

app.listen(PORT, ()=>{
    console.log(`Server is Listening to PORT:${PORT}`);
    
})

