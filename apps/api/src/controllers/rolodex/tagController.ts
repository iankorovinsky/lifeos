import type { Response, NextFunction } from 'express';
import type { ApiResponse, CreateTagRequest, Tag, UpdateTagRequest } from '@lifeos/types';
import type { AuthenticatedRequest } from '../../middlewares/requireUser';
import { createAppError } from '../../utils/errors';
import { createTag, deleteTag, listTags, updateTag } from '../../models/rolodex/tag';

export const getTags = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tags = await listTags(req.userId);
    const response: ApiResponse<Tag[]> = {
      success: true,
      data: tags,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createTagHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as CreateTagRequest;
    if (!body.name) {
      throw createAppError('Tag name is required.', 400);
    }

    const tag = await createTag(req.userId, body);
    const response: ApiResponse<Tag> = {
      success: true,
      data: tag,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateTagHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as UpdateTagRequest;
    const tag = await updateTag(req.userId, req.params.id, body);
    if (!tag) {
      throw createAppError('Tag not found.', 404);
    }

    const response: ApiResponse<Tag> = {
      success: true,
      data: tag,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteTagHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = await deleteTag(req.userId, req.params.id);
    if (!tag) {
      throw createAppError('Tag not found.', 404);
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
