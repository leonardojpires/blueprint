import { NextFunction, Request, Response } from "express";

const studyPlanValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, weeks } = req.body;

  if (
    typeof title !== "string" ||
    title.trim().length < 3 ||
    title.trim().length > 255
  ) {
    return res.status(422).json({
      message: "Validation failed",
      fields: {
        title: "Title must be a string between 3 and 255 characters",
      },
    });
  }

  if (typeof description !== "string") {
    return res.status(422).json({
      message: "Validation failed",
      fields: {
        description: "Description must be a string (empty or not)",
      },
    });
  }

  if (!Array.isArray(weeks)) {
    return res.status(422).json({
      message: "Validation failed",
      fields: {
        weeks: "Weeks must be an array",
      },
    });
  }

  const weekNumbers = new Set<number>();

  for (const week of weeks) {
    if (
      !Number.isInteger(week.week_number) ||
      week.week_number <= 0
    ) {
      return res.status(422).json({
        message: "Validation failed",
        fields: {
          week_number: "Week number must be a positive integer",
        },
      });
    }

    if (weekNumbers.has(week.week_number)) {
      return res.status(422).json({
        message: "Validation failed",
        fields: {
          week_number: "Week number must be unique",
        },
      });
    }

    weekNumbers.add(week.week_number);

    if (
      typeof week.title !== "string" ||
      week.title.trim().length < 3 ||
      week.title.trim().length > 255
    ) {
      return res.status(422).json({
        message: "Validation failed",
        fields: {
          week_title:
            "Week title must be a string between 3 and 255 characters",
        },
      });
    }

    if (!Array.isArray(week.objectives)) {
      return res.status(422).json({
        message: "Validation failed",
        fields: {
          week_objectives: "Week objectives must be an array",
        },
      });
    }

    for (const objective of week.objectives) {
      if (
        typeof objective !== "string" ||
        objective.trim().length < 3 ||
        objective.trim().length > 255
      ) {
        return res.status(422).json({
          message: "Validation failed",
          fields: {
            week_objectives:
              "Each week objective must be a string between 3 and 255 characters",
          },
        });
      }
    }

    if (!Array.isArray(week.topics)) {
      return res.status(422).json({
        message: "Validation failed",
        fields: {
          week_topics: "Week topics must be an array",
        },
      });
    }

    for (const topic of week.topics) {
      if (
        typeof topic !== "string" ||
        topic.trim().length < 3 ||
        topic.trim().length > 255
      ) {
        return res.status(422).json({
          message: "Validation failed",
          fields: {
            week_topics:
              "Each week topic must be a string between 3 and 255 characters",
          },
        });
      }
    }
  }

  next();
};

export default studyPlanValidator;
