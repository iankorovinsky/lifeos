import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse, Ask, CreateAskRequest, UpdateAskRequest } from '@lifeos/types';
import type { AuthenticatedRequest } from '../../middlewares/requireUser';
import { createAppError } from '../../utils/errors';
import { parseQueryBoolean } from '../../utils/query';
import { createAsk, deleteAsk, listAsks, updateAsk } from '../../models/rolodex/ask';

export const getAsks = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as AuthenticatedRequest;
  try {
    const personId = typeof req.query.personId === 'string' ? req.query.personId : undefined;
    const completed = parseQueryBoolean(req.query.completed);

    const asks = await listAsks(userId, { personId, completed });
    const response: ApiResponse<Ask[]> = {
      success: true,
      data: asks,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createAskHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as AuthenticatedRequest;
  try {
    const body = req.body as CreateAskRequest;
    if (!body.personId || !body.description) {
      throw createAppError('personId and description are required.', 400);
    }

    const ask = await createAsk(userId, body);
    const response: ApiResponse<Ask> = {
      success: true,
      data: ask,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateAskHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as AuthenticatedRequest;
  try {
    const body = req.body as UpdateAskRequest;
    const ask = await updateAsk(userId, req.params.id, body);
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

export const deleteAskHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req as AuthenticatedRequest;
  try {
    const ask = await deleteAsk(userId, req.params.id);
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
