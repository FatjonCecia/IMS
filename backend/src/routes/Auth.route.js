const router  = require("express").Router()

const app =require("express").Router()

router.get("/",(req,res)=>{

    res.json({msg:"hello world"})

})

module.exports =router