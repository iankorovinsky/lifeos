import { prisma } from '@lifeos/db';
import type { Ask, AskFilters, CreateAskRequest, UpdateAskRequest } from '@lifeos/types';
import { ensurePersonOwnedByUser } from '../../utils/rolodex';

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

export const createAsk = async (userId: string, data: CreateAskRequest): Promise<Ask> => {
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
  data: UpdateAskRequest
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
