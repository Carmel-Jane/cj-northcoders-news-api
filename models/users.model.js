const db = require("../db/connection");
function readUsers() {
    return db.query(`SELECT * FROM users;`)
    .then(({rows}) => {
        return rows
    })
}
module.exports = {readUsers}