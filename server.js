const express = require('express')
const app=express()


app.get('/ping',(req,res)=>{
    res.send("hello world")
})


app.listen(4000,()=>{
    console.log(`successfully listen at 4000`)
})