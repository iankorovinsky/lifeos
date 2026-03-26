import { prisma } from '@lifeos/db';
import type { Prisma } from '@lifeos/db';
import type {
  Person,
  PeopleFilters,
  CreatePersonRequest,
  UpdatePersonRequest,
  RoleInput,
} from '@lifeos/types';
import { createAppError } from '../../utils/errors';

const personInclude = {
  roles: true,
  tags: {
    include: {
      tag: true,
    },
  },
  emails: {
    orderBy: [{ isPrimary: 'desc' as const }, { email: 'asc' as const }],
  },
  emailEvents: {
    orderBy: {
      occurredAt: 'desc' as const,
    },
  },
  calendarEvents: {
    orderBy: {
      startsAt: 'desc' as const,
    },
  },
  notes: true,
  requests: true,
} satisfies Prisma.PersonInclude;

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

const normalizeRoles = (roles: RoleInput[] | undefined) =>
  roles
    ?.map((role) => ({
      title: role.title.trim(),
      company: role.company?.trim() || undefined,
    }))
    .filter((role) => role.title.length > 0) ?? [];

const normalizeEmails = (emails: string[] | undefined) => {
  const normalized =
    emails?.map((email) => email.trim().toLowerCase()).filter((email) => email.length > 0) ?? [];

  return [...new Set(normalized)];
};

export const listPeople = async (userId: string, filters: PeopleFilters) => {
  const where: Prisma.PersonWhereInput = {
    userId,
    deletedAt: null,
  };

  if (filters.search) {
    const search = filters.search;
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { phoneNumber: { contains: search, mode: 'insensitive' } },
      { linkedinUrl: { contains: search, mode: 'insensitive' } },
      { xUrl: { contains: search, mode: 'insensitive' } },
      {
        emails: {
          some: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
      },
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
    orderBy: [{ isFavorite: 'desc' }, { firstName: 'asc' }, { lastName: 'asc' }],
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
  const roles = normalizeRoles(data.roles);
  const emails = normalizeEmails(data.emails);
  await validateTagIds(userId, tagIds);

  const person = await prisma.person.create({
    data: {
      userId,
      firstName: data.firstName.trim(),
      lastName: data.lastName?.trim() || undefined,
      description: data.description,
      phoneNumber: data.phoneNumber?.trim() || undefined,
      linkedinUrl: data.linkedinUrl?.trim() || undefined,
      xUrl: data.xUrl?.trim() || undefined,
      isFavorite: data.isFavorite ?? false,
      emails: emails.length
        ? {
            create: emails.map((email, index) => ({
              email,
              isPrimary: index === 0,
            })),
          }
        : undefined,
      roles: roles.length
        ? {
            create: roles,
          }
        : undefined,
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
  const roles = data.roles ? normalizeRoles(data.roles) : undefined;
  const emails = data.emails ? normalizeEmails(data.emails) : undefined;
  if (tagIds) {
    await validateTagIds(userId, tagIds);
  }

  const person = await prisma.person.update({
    where: { id },
    data: {
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim() || undefined,
      description: data.description,
      phoneNumber: data.phoneNumber?.trim() || undefined,
      linkedinUrl: data.linkedinUrl?.trim() || undefined,
      xUrl: data.xUrl?.trim() || undefined,
      isFavorite: data.isFavorite,
      emails:
        emails !== undefined
          ? {
              deleteMany: {},
              create: emails.map((email, index) => ({
                email,
                isPrimary: index === 0,
              })),
            }
          : undefined,
      roles:
        roles !== undefined
          ? {
              deleteMany: {},
              create: roles,
            }
          : undefined,
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
