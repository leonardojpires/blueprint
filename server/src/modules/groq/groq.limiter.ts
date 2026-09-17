import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

const groqLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        if (req.user?.sub) return req.user?.sub.toString();

        const ipv6Subnet = 56;
        return req.ip ? ipKeyGenerator(req.ip, ipv6Subnet) : '';
    },
    message: {
        error: "Too many requests. Please try again later."
    }
});

export { groqLimiter };
