const { NODE_ENV } = require('./config');

const errorHandler = (error, req, res, next) => {
    let response;
    if (NODE_ENV === 'production') {
        response = {
            error: {
                message: 'Server error'
            }
        };
    } else {
        response = {
            message: error.message, error
        };

    };
    res.status(500).json(response);
};

module.exports = errorHandler;
