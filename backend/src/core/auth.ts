import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('[Auth] FATAL: JWT_SECRET is not set in environment variables. Set it in .env');
  process.exit(1);
}

export interface AuthUser {
  id: string;
  userId?: string;
  employee_id?: number;
  employeeId?: string | number | null;
  role: string;
  roleId?: string;
  email?: string;
  // Impersonation support
  impersonatedBy?: string | null;
  isImpersonating?: boolean;
}

export interface UserPayload {
  userId: string;
  email: string;
  roleId: string;
  employeeId?: string | null;
  // Impersonation support
  impersonatedBy?: string | null;
  isImpersonating?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function generateToken(payload: AuthUser | UserPayload, expiresIn: string | number = '24h'): string {
  return jwt.sign(payload as object, JWT_SECRET!, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as AuthUser;
  } catch (err) {
    return null;
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication token is required' } });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }

  req.user = user;
  next();
};

export const authMiddleware = authenticateToken;

export const requireRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    }

    const currentRoleRaw = String(req.user.role || req.user.roleId || '').toLowerCase().replace(/\s+/g, '_');
    const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase().replace(/\s+/g, '_'));

    if (currentRoleRaw === 'admin') {
      return next();
    }

    if (!currentRoleRaw || !normalizedAllowed.includes(currentRoleRaw)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN_ROLE', message: `Access denied. Role '${req.user.role || req.user.roleId}' is not permitted.` }
      });
    }

    next();
  };
};

export const requireRole = requireRoles;
