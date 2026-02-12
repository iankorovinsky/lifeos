import type { Response, NextFunction } from 'express';
import type { ApiResponse, CreateFavourRequest, Favour, UpdateFavourRequest } from '@lifeos/types';
import type { AuthenticatedRequest } from '../../middlewares/requireUser';
import { createAppError } from '../../utils/errors';
import { parseQueryBoolean } from '../../utils/query';
import { createFavour, deleteFavour, listFavours, updateFavour } from '../../models/rolodex/favour';

export const getFavours = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const personId = typeof req.query.personId === 'string' ? req.query.personId : undefined;
    const completed = parseQueryBoolean(req.query.completed);

    const favours = await listFavours(req.userId, { personId, completed });
    const response: ApiResponse<Favour[]> = {
      success: true,
      data: favours,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createFavourHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as CreateFavourRequest;
    if (!body.personId || !body.description) {
      throw createAppError('personId and description are required.', 400);
    }

    const favour = await createFavour(req.userId, body);
    const response: ApiResponse<Favour> = {
      success: true,
      data: favour,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateFavourHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as UpdateFavourRequest;
    const favour = await updateFavour(req.userId, req.params.id, body);
    if (!favour) {
      throw createAppError('Favour not found.', 404);
    }

    const response: ApiResponse<Favour> = {
      success: true,
      data: favour,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteFavourHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const favour = await deleteFavour(req.userId, req.params.id);
    if (!favour) {
      throw createAppError('Favour not found.', 404);
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
