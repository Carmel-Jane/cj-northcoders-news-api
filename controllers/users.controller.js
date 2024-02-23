const {readUsers} = require('../models/users.model')
function getAllUsers(req, res, next){
    readUsers().then((users) => {
      res.status(200).send({ users });
    });
  };

module.exports ={getAllUsers}