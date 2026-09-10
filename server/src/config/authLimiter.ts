import { rateLimit } from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 7,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        const { email } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (normalizedEmail) return normalizedEmail;
    },
    message: {
        error: "Too many requests. Please try again later."
    }
});

const loginIpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 7,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: {
        error: "Too many requests. Please try again later."
    }
});

const registerLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: {
        error: "Too many requests. Please try again later."
    }
});

export { loginLimiter, loginIpLimiter, registerLimiter };
