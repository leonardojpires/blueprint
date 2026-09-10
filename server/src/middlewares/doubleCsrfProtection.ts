import { doubleCsrf } from "csrf-csrf";
import { ErrorRequestHandler, Request, Response } from "express";

const {
    invalidCsrfTokenError,
    generateCsrfToken,
    doubleCsrfProtection
} = doubleCsrf({
    getSecret: () => {
        const secret = process.env.CSRF_SECRET;

        if (!secret) throw new Error("CSRF_SECRET is not configured.");

        return secret;
    },
    getSessionIdentifier: (req) => {
        if (!req.user) {
            throw new Error("User not found.");
        }

        return req.user.jti;
    },
    cookieOptions: {
        secure: true,
        sameSite: 'none'
    }
});

const generateCsrfTokenHandler = (req: Request, res: Response) => {
    const csrfToken = generateCsrfToken(req, res);
    res.json({ csrfToken });
}

const handleCsrfError: ErrorRequestHandler = (error, _req, res, next) => {
    if (error === invalidCsrfTokenError) {
        res.status(403).json({
            message: "Your session could not be verified. Please refresh and try again."
        });
        return;
    }

    next(error);
};

export {
    generateCsrfTokenHandler,
    doubleCsrfProtection,
    handleCsrfError
}
