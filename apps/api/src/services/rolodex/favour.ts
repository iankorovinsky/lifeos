import { prisma } from '@lifeos/db';
import type {
  Favour,
  FavourFilters,
  CreateFavourRequest,
  UpdateFavourRequest,
} from '@lifeos/types';
import { ensurePersonOwnedByUser } from '../../utils/rolodex';

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

export const createFavour = async (userId: string, data: CreateFavourRequest): Promise<Favour> => {
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
  data: UpdateFavourRequest
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
