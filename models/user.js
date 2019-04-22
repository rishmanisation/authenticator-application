const jwt = require('jwt-simple');

/**
 * Generates the JWT for the user.
 * @param {Object} user 
 * @param {function} callback 
 */
function tokenForUser(user, callback) {
    var timeStamp = new Date().getTime()
    return callback(jwt.encode({ sub: user, iat: timeStamp }, 'secret'));
}


/**
 * Function to update the user information in the DB upon sign-in.
 * @param {Object} user 
 */
function updateUserInformation(user) {
    var firstName = user.name.givenName;
    var lastName = user.name.familyName;
    var email = user.emails[0].value;
    var updateQuery = "update user_details set first_name='" + firstName + "', last_name='" + lastName + "' where email_id='" + email + "'";
    db.query(updateQuery, (err, result) => {
        if(err) {
            throw err;
        }
    });
}

/**
 * Retrieves all the whitelisted users.
 * @param {Object} user 
 * @param {function} callback 
 */
function getAllWhitelisted(user, callback) {
    var allWhitelistedQuery = "select email_id, concat(first_name, ' ', last_name) as name from user_details";
    db.query(allWhitelistedQuery, (err, result) => {
        if(err) {
            throw err;
        }
        return callback(result);
    });
}

/**
 * Filters user records based on email id.
 * @param {Object} payload 
 * @param {function} callback 
 */
function getUserByEmail(payload, callback) {
    var email = payload.email;
    var query = "select user_id, email_id, first_name, last_name from user_details where email_id='" + email + "'";
    db.query(query, (err, result) => {
        if(err) {
            throw err;
        }
        return callback(result);
    });

}

/**
 * Check whether a given email id is whitelisted or not.
 * @param {Object} email
 * @param {function} callback
 */
exports.isWhitelisted = function(email, callback) {
    var checkQuery = 'select count(*) as count from user_details where email_id=' + "'" + email + "'";
    db.query(checkQuery, function(err, result) {
        if(err) {
            throw err;
        }
        return callback(result[0].count === 0);
    });
}

/**
 * Whitelist a user.
 * @param {Object} email
 * @param {function} callback
 */
exports.whitelistUser = function(email, callback) {
    var insertQuery = "insert into user_details(email_id, first_name, last_name) values('" + email + "', 'test', 'user')";
    db.query(insertQuery, (err, result) => {
        return callback(err, result);
    });
}
/**
 * Generates the payload for a user. Payload consists of current user information, a list of all whitelisted users (for 
 * display on the profile page) and the user's JWT.
 * @param {Object} user
 * @param {function} callback
 */
exports.getPayload = function(user, callback) {
    updateUserInformation(user);
    getUserByEmail({email: user.emails[0].value}, (result) => {
        const currUserInfo = result[0];
        getAllWhitelisted(user, (result) => {
            const allUsers = result;
            tokenForUser(user, (result) => {
                const token = result;
                return callback({ user: currUserInfo, allUsers: allUsers, token: token });
            });
        });
    });
}




