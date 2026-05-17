import type { Request, Response, NextFunction } from "express"
import { verifyToken, type JwtPayload } from "../lib/jwt.js"

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Unauthorized" })
    return
  }
  try {
    const token = header.slice(7)
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" })
  }
}