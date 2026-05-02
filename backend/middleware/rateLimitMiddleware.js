const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 login requests per windowMs
    message: {
        message: "Too many failed login attempts. Please try again after 5 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const postReplyLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: {
        message: "You are posting too fast. Please wait before submitting again."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter, postReplyLimiter };
