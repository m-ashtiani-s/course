const express=require("express")

const router=express.Router()

router.get('/',(req,res)=>{
    res.json('welcome to h')
})


router.get('/about',(req,res)=>{
    res.json('welcome to 2')

})

module.exports= router;