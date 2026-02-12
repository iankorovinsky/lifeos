import type {
  Ask as DbAsk,
  Favour as DbFavour,
  Person as DbPerson,
  PersonNote as DbPersonNote,
  Role as DbRole,
  Tag as DbTag,
} from '@lifeos/db';

export type Role = DbRole;
export type Tag = DbTag;
export type PersonNote = DbPersonNote;

export type Ask = DbAsk & {
  children?: Ask[];
};

export type Favour = DbFavour & {
  children?: Favour[];
};

export type Person = DbPerson & {
  roles: Role[];
  tags: Tag[];
  notes: PersonNote[];
  asks: Ask[];
  favours: Favour[];
};

export type CreatePersonRequest = {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  isFavorite?: boolean;
  tagIds?: string[];
};

export type UpdatePersonRequest = {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  isFavorite?: boolean;
  tagIds?: string[];
};

export type CreateRoleRequest = {
  personId: string;
  title: string;
  company?: string;
};

export type CreateTagRequest = {
  name: string;
  color?: string;
};

export type UpdateTagRequest = {
  name?: string;
  color?: string;
};

export type CreateAskRequest = {
  personId: string;
  description: string;
  parentId?: string;
};

export type CreateFavourRequest = {
  personId: string;
  description: string;
  parentId?: string;
};

export type UpdateAskRequest = {
  description?: string;
  completed?: boolean;
  parentId?: string | null;
};

export type UpdateFavourRequest = {
  description?: string;
  completed?: boolean;
  parentId?: string | null;
};

// Query/filter types
export interface PeopleQueryParams {
  search?: string;
  tagIds?: string;
  limit?: number;
  offset?: number;
}

export interface PeopleFilters {
  search?: string;
  tagIds?: string[];
  limit?: number;
  offset?: number;
}

export interface AskFilters {
  personId?: string;
  completed?: boolean;
}

export interface FavourFilters {
  personId?: string;
  completed?: boolean;
}
