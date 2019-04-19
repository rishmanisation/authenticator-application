const jwt = require('jwt-simple');

function tokenForUser(user) {
    var timeStamp = new Date().getTime()
    return jwt.encode({ sub: user, iat: timeStamp }, 'secret');
}

function getAllWhitelisted(user) {
    var firstName = user.name.givenName;
    var lastName = user.name.familyName;
    var email = user.emails[0].value;
    var updateQuery = 'update user_details set first_name=' + "'" + firstName 
    + "' , last_name='" + lastName + "' where email_id='" + email + "'";
    db.query(updateQuery, (err) => {
        if(err) {
            throw err;
        }
    });

    var allWhitelistedQuery = "select email_id, concat(first_name, ' ', last_name) as name from user_details";
    var result = db.query(allWhitelistedQuery, (err, result) => {
        if(err) {
            throw err;
        }
        return result;
    });

    return result;
}

exports.getUserByEmail = function(payload) {
    var email = payload.email;
    var query = "select email_id, first_name, last_name from user_details where email_id='" + email + "'";
    db.query(query, (err, result) => {
        if(err) {
            throw err;
        }
    });

}

exports.isWhitelisted = function(user) {
    var email = user.emails[0].value;
    var checkQuery = 'select count(*) as count from user_details where email_id=' + "'" + email + "'";
    var result = db.query(checkQuery, (err, result) => {
        if(err) {
            throw err;
        }
        if(result[0].count === 0) {
            return false;
        }
        if(result[0].count != 0) {
            return true;
        }
    });
    return result;
}

exports.whitelistUser = function(email) {
    var insertQuery = "insert into user_details values('" + email + "', 'test', 'user')";
    var result = db.query(insertQuery, (err, result) => {
        if(err) {
            console.log(err);
            throw err;
        }
        return result;
    });
    return result;
}

exports.getPayload = function(user) {
    const token = tokenForUser(user);
    const result = getAllWhitelisted(user);
    return { user: user, allUsers: result, token: token};
}



