import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '@lifeos/types';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.header('x-user-id');

  if (!userId) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        message: 'Missing user id',
        status: 401,
        code: 'UNAUTHORIZED',
      },
    };
    res.status(401).json(response);
    return;
  }

  (req as AuthenticatedRequest).userId = userId;
  next();
};
