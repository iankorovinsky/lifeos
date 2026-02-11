import { prisma } from '@lifeos/db';
import type { Ask } from '@lifeos/types';
import { createAppError } from '../../utils/errors';

type AskFilters = {
  personId?: string;
  completed?: boolean;
};

type CreateAskData = {
  personId: string;
  description: string;
  parentId?: string;
};

type UpdateAskData = {
  description?: string;
  completed?: boolean;
  parentId?: string | null;
};

const ensurePersonOwnedByUser = async (userId: string, personId: string) => {
  const person = await prisma.person.findFirst({
    where: { id: personId, userId, deletedAt: null },
    select: { id: true },
  });

  if (!person) {
    throw createAppError('Person not found.', 404);
  }
};

export const listAsks = async (userId: string, filters: AskFilters): Promise<Ask[]> => {
  return prisma.ask.findMany({
    where: {
      person: { userId },
      personId: filters.personId,
      completed: filters.completed,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createAsk = async (userId: string, data: CreateAskData): Promise<Ask> => {
  await ensurePersonOwnedByUser(userId, data.personId);

  return prisma.ask.create({
    data: {
      personId: data.personId,
      description: data.description,
      parentId: data.parentId,
    },
  });
};

export const updateAsk = async (
  userId: string,
  id: string,
  data: UpdateAskData
): Promise<Ask | null> => {
  const existing = await prisma.ask.findFirst({
    where: { id, person: { userId } },
  });

  if (!existing) {
    return null;
  }

  return prisma.ask.update({
    where: { id },
    data: {
      description: data.description,
      completed: data.completed,
      parentId: data.parentId,
    },
  });
};

export const deleteAsk = async (userId: string, id: string): Promise<Ask | null> => {
  const existing = await prisma.ask.findFirst({
    where: { id, person: { userId } },
  });

  if (!existing) {
    return null;
  }

  return prisma.ask.delete({ where: { id } });
};
