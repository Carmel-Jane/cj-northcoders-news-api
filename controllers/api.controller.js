const endpoints = require("../endpoints.json");

function getAllEndpoints(req, res, next){
    console.log(endpoints)
    res.send(endpoints);
};

module.exports = getAllEndpoints