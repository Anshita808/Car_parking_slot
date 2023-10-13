const rateLimiter = require("express-rate-limit");


const rateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per IP
});


module.exports = {rateLimit}