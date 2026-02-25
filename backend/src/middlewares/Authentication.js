const { header } = require("express-validator")
const APiError = require("../utils/APiError")
const httpStatus=require("http-status")
const { verify } = require("jsonwebtoken")
const { validateToken } = require("../utils/Token.utils")

const Authentication =(req,res,next)=>{
    try{


        const headers =req.header['authorization'] || ''

        if(!headers || !headers.startsWith("Bearer")){
            throw new APiError(httpStatus.UNAUTHORIZED,"Please Login first")
        }

        const auth_token = headers.split(" ")[1]

        if(!auth_token){
            throw new APiError(httpStatus.UNAUTHORIZED,"Please provide valid")

        }
        const data=validateToken(auth_token)
        req.user=data.userid
    
        next()
    } catch (error){
        next(error)
    }
}
module.exports=Authentication