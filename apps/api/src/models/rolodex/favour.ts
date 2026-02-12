import { prisma } from '@lifeos/db';
import type { Favour } from '@lifeos/types';
import { createAppError } from '../../utils/errors';

type FavourFilters = {
  personId?: string;
  completed?: boolean;
};

type CreateFavourData = {
  personId: string;
  description: string;
  parentId?: string;
};

type UpdateFavourData = {
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

export const listFavours = async (userId: string, filters: FavourFilters): Promise<Favour[]> => {
  return prisma.favour.findMany({
    where: {
      person: { userId },
      personId: filters.personId,
      completed: filters.completed,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createFavour = async (userId: string, data: CreateFavourData): Promise<Favour> => {
  await ensurePersonOwnedByUser(userId, data.personId);

  return prisma.favour.create({
    data: {
      personId: data.personId,
      description: data.description,
      parentId: data.parentId,
    },
  });
};

export const updateFavour = async (
  userId: string,
  id: string,
  data: UpdateFavourData
): Promise<Favour | null> => {
  const existing = await prisma.favour.findFirst({
    where: { id, person: { userId } },
  });

  if (!existing) {
    return null;
  }

  return prisma.favour.update({
    where: { id },
    data: {
      description: data.description,
      completed: data.completed,
      parentId: data.parentId,
    },
  });
};

export const deleteFavour = async (userId: string, id: string): Promise<Favour | null> => {
  const existing = await prisma.favour.findFirst({
    where: { id, person: { userId } },
  });

  if (!existing) {
    return null;
  }

  return prisma.favour.delete({ where: { id } });
};
