
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const mysql = require("mysql")

const app = express()

app.use(cors())

let conn = mysql.createConnection({
    user:process.env.LIBRARYUSER,
    password:process.env.LIBRARYPASSWORD,
    host:process.env.LIBRARYHOST,
    database:process.env.LIBRARYDB
})


conn.connect((err)=>{
    if(err)
    {
        console.log(err);
    }
    else {
        console.log("Mysql connect successfully");
    }
})


app.get('/',(req,res)=>{
    let GET_BOOKS = 'SELECT * FROM library';
    conn.query(GET_BOOKS,(err,result)=>{
        if(err)
        {
            throw err;
        }
        res.send(result);
        console.log("sended");
    })
})


app.listen(8000,()=>{
    console.log("Server started running in the port 8000");
})

