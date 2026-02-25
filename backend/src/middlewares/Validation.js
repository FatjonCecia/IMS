const { validationResult } = require("express-validator");
const APiError= require("../utils/APiError");
const httpStatus =require("http-status");


const Validation=(req,res,next)=>{
    try{

        const result=validationResult(req);
        if(!result.isEmpty()){

            throw new APiError(httpStatus.BAD_REQUEST,result.array()[0].msg)
            return
        }

        next()
    }catch(error){

        next(error)
    }
}

module.exports=Validation