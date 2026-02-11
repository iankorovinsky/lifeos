import type { Response, NextFunction } from 'express';
import type { ApiResponse, Ask, CreateAskRequest, UpdateAskRequest } from '@lifeos/types';
import type { AuthenticatedRequest } from '../../middlewares/requireUser';
import { createAppError } from '../../utils/errors';
import { createAsk, deleteAsk, listAsks, updateAsk } from '../../models/rolodex/ask';

const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (!value) {
    return undefined;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
};

export const getAsks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const personId = typeof req.query.personId === 'string' ? req.query.personId : undefined;
    const completed = typeof req.query.completed === 'string'
      ? parseBoolean(req.query.completed)
      : undefined;

    const asks = await listAsks(req.userId, { personId, completed });
    const response: ApiResponse<Ask[]> = {
      success: true,
      data: asks,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createAskHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as CreateAskRequest;
    if (!body.personId || !body.description) {
      throw createAppError('personId and description are required.', 400);
    }

    const ask = await createAsk(req.userId, body);
    const response: ApiResponse<Ask> = {
      success: true,
      data: ask,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateAskHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as UpdateAskRequest;
    const ask = await updateAsk(req.userId, req.params.id, body);
    if (!ask) {
      throw createAppError('Ask not found.', 404);
    }

    const response: ApiResponse<Ask> = {
      success: true,
      data: ask,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteAskHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ask = await deleteAsk(req.userId, req.params.id);
    if (!ask) {
      throw createAppError('Ask not found.', 404);
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};
