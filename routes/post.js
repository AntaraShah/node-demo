const router = require('express').Router();
const comCon = require('../constants/comCon');
const verify = require('./verifyToken')
status  = require('http-status')
const sql = require("mssql");
const setting = require("../repository/sqldb");

router.get('/display', verify,async (req, res) => {
    try {
        if(sql.ConnectionPool)
            connectionFunc = sql.ConnectionPool;
        else 
            connectionFunc = sql.Connection;
        
        let connection = new connectionFunc(setting.sqlConfig, function(err){
            if(err){
                console.log("error while connecting to Database",err)
                callback("ERRPR",null);
            } else {
                var request = new sql.Request(connection);
                request.query('select * from categoryMaster', function(err,recordset){
                    if(err){
                        let data = {
                            "code": "400FAIL",
                            "message": "some technical problem occurs",
                            "data":[]
                        }
                        res.status(status.OK).send(data)
                    } else {
                        let data = {
                            "code": "200SUCESS",
                            "message": "data get successfully",
                            "data":recordset.recordset
                        }
                        res.status(status.OK).send(data)
                    }
                })

            }
        })
    } catch (error) {
        if (error.status) res.status(error.status).send({"error_message": error.message})
        res.status(status.INTERNAL_SERVER_ERROR).send({"error_message": error})
    }
})

router.get('/category/list',verify, async (req, res) => {
    try {
        if(sql.ConnectionPool)
            connectionFunc = sql.ConnectionPool;
        else 
            connectionFunc = sql.Connection;        
        let connection = new connectionFunc(setting.sqlConfig, function(err){
            if(err){
                console.log("error while connecting to Database",err)
                callback("ERRPR",null);
            } else {
                var request = new sql.Request(connection);
                request.query('SELECT categoryID,categoryName FROM categoryMaster', function(err,recordset){
                    if(err){
                        let data = {
                            "code": "400FAIL",
                            "message": "some technical problem occurs",
                            "data":[]
                        }
                        res.status(status.OK).send(data)
                    } else {
                        let data = {
                            "code": "200SUCESS",
                            "message": "data get successfully",
                            "data":recordset.recordset
                        }
                        res.status(status.OK).send(data)
                    }
                })

            }
        })
    } catch (error) {
        if (error.status) res.status(error.status).send({"error_message": error.message})
        res.status(status.INTERNAL_SERVER_ERROR).send({"error_message": error})
    }
})

module.exports = router