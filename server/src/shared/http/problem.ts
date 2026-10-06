import type { Response } from "express";

const titles = {
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  413: "Content Too Large",
  422: "Unprocessable Content",
  500: "Internal Server Error",
  502: "Bad Gateway",
} as const;

export function sendProblem(
  res: Response,
  status: keyof typeof titles,
  code: string,
  detail: string,
) {
  return res.status(status).type("application/problem+json").json({
    type: "about:blank",
    title: titles[status],
    status,
    detail,
    code,
  });
}
