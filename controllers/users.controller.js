const {readUsers, readUserByUsername} = require('../models/users.model')
function getAllUsers(req, res, next){
    readUsers().then((users) => {
      res.status(200).send({ users });
    });
  };
  function getUserByUsername(req, res, next){
    const { username } = req.params;
    readUserByUsername(username).then((user) => {
      res.status(200).send({ user });
    }).catch(next);
  };

module.exports ={getAllUsers, getUserByUsername}