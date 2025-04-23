const express = require('express');
require('./config/database');
const cors = require('cors')
const morgan = require('morgan')

const transactionRouter = require('./routes/transactionRouter');



const PORT = 8550;
const app = express()

app.use(express.json())
app.use(cors({origin: '*'}));
app.use(morgan('dev'));
app.use( transactionRouter)

app.listen(PORT, ()=>{
    console.log(`Server is Listening to PORT:${PORT}`);
    
})

