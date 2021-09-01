const router = require('express').Router()
const { registration } = require('../services/registration')
const { login } = require('../services/login')
const status  = require('http-status')
const comCon = require('../constants/comCon')

router.post('/register', async (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   
    try {
        const body = req.body
        let response = await registration(body)     
     
        res.status(status.OK).send(response)
    } catch (error) {
        if (error.status) res.status(error.status).send({"error_message": error.message})
        res.status(status.INTERNAL_SERVER_ERROR).send({"error_message": error})
    }
    
})

// Login API

router.post('/login', async (req,res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   
    try {
        const response = await login(req.body)
        res.setHeader(comCon.FIELD_AUTH_TOKEN, response.token)
        res.setHeader(comCon.FIELD_USER_CODE, response[comCon.FIELD_USER_CODE])
        let data = {
            "code": "200SUCESSLOGIN",
            "message": "Login Sucess",
            "name": response[comCon.FIELD_NAME],
            "auth_token": response.token,
            "user_code":response[comCon.FIELD_USER_CODE]
        }
        res.status(status.OK).send({data})
    } catch (error) {
        if (error.status) res.status(error.status).send({"error_message": error.message})
        res.status(status.INTERNAL_SERVER_ERROR).send({"error_message": error})
    }
})
  
  
module.exports = router