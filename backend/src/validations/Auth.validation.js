
const{body}=require("express-validator")

class AuthValidation{
static  RegisterUser=[
    body("name").notEmpty().withMessage("Dont leave name empty"),
    body("email").isEmail().withMessage("email must be vlid").notEmpty().withMessage("email cant be empty"),
    body("password").isLength({min:8}).withMessage("password should have 8 characters").notEmpty().withMessage("password is  needed")
]
static  LoginUser=[
    body("email").isEmail().withMessage("email must be vlid").notEmpty().withMessage("email cant be empty"),
    body("password").isLength({min:8}).withMessage("password should have 8 characters").notEmpty().withMessage("password is  needed")
]


}

module.exports=AuthValidation