const jwt = require ('jwt-simple');
const moment = require('moment');

const SECRET_KEY = "gr7HTYU12847SAFd54try568821";

exports.createAccessToken = function ( user ) {
    const playload ={
        id          : user.id,
        name        : user.name,
        lastname    : user.lastname,
        email       : user.email,
        role        : user.role,
        createToken : moment.unix(),
        exp: moment().add(10, 'hours').unix()
    }
    return jwt.encode( playload, SECRET_KEY );
}

exports.createRefreshToken = function ( user ){
    const playload = {
        id  : user._id,
        exp : moment().add(30,'days').unix()
    }
    return jwt.encode( playload, SECRET_KEY );
}

exports.decodedToken = function ( token ){
    return jwt.decode( token, SECRET_KEY, true );
}