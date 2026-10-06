import { NextFunction, Request, Response } from "express";


const studyPlanValidator = (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;

    if (
        typeof title !== "string" ||
        title.trim().length < 3 ||
        title.trim().length > 255
    ) {
        return res.status(422).json({
            message: "Validation failed",
            fields: {
                title: "Title must between 3 and 255 characters"
            }
        });
    }

    next();
}

export default studyPlanValidator;
