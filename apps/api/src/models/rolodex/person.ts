import type { Prisma } from '@lifeos/db';
import { prisma } from '@lifeos/db';
import type { Person, PeopleFilters, CreatePersonRequest, UpdatePersonRequest } from '@lifeos/types';
import { createAppError } from '../../utils/errors';

const personInclude = {
  roles: true,
  tags: {
    include: {
      tag: true,
    },
  },
  notes: true,
  asks: true,
  favours: true,
};

type PersonWithRelations = Prisma.PersonGetPayload<{
  include: typeof personInclude;
}>;

const mapPerson = (person: PersonWithRelations): Person => {
  const { tags, ...rest } = person;
  return {
    ...rest,
    tags: tags.map((personTag) => personTag.tag),
  };
};

const validateTagIds = async (userId: string, tagIds: string[]) => {
  if (tagIds.length === 0) {
    return;
  }

  const count = await prisma.tag.count({
    where: {
      userId,
      id: { in: tagIds },
    },
  });

  if (count !== tagIds.length) {
    throw createAppError('One or more tags do not belong to the user.', 400);
  }
};

export const listPeople = async (userId: string, filters: PeopleFilters) => {
  const where: Prisma.PersonWhereInput = {
    userId,
    deletedAt: null,
  };

  if (filters.search) {
    const search = filters.search;
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      {
        roles: {
          some: {
            title: { contains: search, mode: 'insensitive' },
          },
        },
      },
      {
        roles: {
          some: {
            company: { contains: search, mode: 'insensitive' },
          },
        },
      },
    ];
  }

  if (filters.tagIds && filters.tagIds.length > 0) {
    where.tags = {
      some: {
        tagId: { in: filters.tagIds },
      },
    };
  }

  const people = await prisma.person.findMany({
    where,
    include: personInclude,
    orderBy: [{ isFavorite: 'desc' }, { name: 'asc' }],
    take: filters.limit,
    skip: filters.offset,
  });

  return people.map(mapPerson);
};

export const getPersonById = async (userId: string, id: string) => {
  const person = await prisma.person.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    include: personInclude,
  });

  return person ? mapPerson(person) : null;
};

export const createPerson = async (userId: string, data: CreatePersonRequest) => {
  const tagIds = data.tagIds ?? [];
  await validateTagIds(userId, tagIds);

  const person = await prisma.person.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      email: data.email,
      phone: data.phone,
      isFavorite: data.isFavorite ?? false,
      tags: tagIds.length
        ? {
            create: tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
    include: personInclude,
  });

  return mapPerson(person);
};

export const updatePerson = async (userId: string, id: string, data: UpdatePersonRequest) => {
  const existing = await prisma.person.findFirst({
    where: { id, userId, deletedAt: null },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  const tagIds = data.tagIds;
  if (tagIds) {
    await validateTagIds(userId, tagIds);
  }

  const person = await prisma.person.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      email: data.email,
      phone: data.phone,
      isFavorite: data.isFavorite,
      tags: tagIds
        ? {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
    include: personInclude,
  });

  return mapPerson(person);
};

export const softDeletePerson = async (userId: string, id: string) => {
  const existing = await prisma.person.findFirst({
    where: { id, userId, deletedAt: null },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  return prisma.person.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
