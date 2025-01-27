import rateLimit from "express-rate-limit";
export const rateLimitLogin=rateLimit({
    windowMs: 1 * 60 * 1000, //  minutes
    max: 10, // Limit each IP to 10 requests per window
    message: {
        error: 'Too many requests, please try again later.',
    },
    headers: true, 
})
export const rateLimitUser=rateLimit({
    windowMs:15*60*1000,
    max:100,
    message: {
        error: 'Too many requests, please try again later.',
    },
    headers: true,
})
export const rateLimitSession=rateLimit({
    windowMs:24 * 60 *60 *1000,
    max:100,
    message:{
        error:'Too Many requests , please try again later.',
    },
    headers:true

})
