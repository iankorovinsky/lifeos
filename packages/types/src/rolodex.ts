export interface Person {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  isFavorite: boolean;
  roles: Role[];
  tags: Tag[];
  notes: PersonNote[];
  asks: Ask[];
  favours: Favour[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Role {
  id: string;
  personId: string;
  title: string;
  company: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonNote {
  id: string;
  personId: string;
  content: string;
  createdAt: Date;
}

export interface Ask {
  id: string;
  personId: string;
  parentId: string | null;
  description: string;
  completed: boolean;
  children?: Ask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Favour {
  id: string;
  personId: string;
  parentId: string | null;
  description: string;
  completed: boolean;
  children?: Favour[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePersonRequest {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  isFavorite?: boolean;
  tagIds?: string[];
}

export interface UpdatePersonRequest {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  isFavorite?: boolean;
  tagIds?: string[];
}

export interface CreateRoleRequest {
  personId: string;
  title: string;
  company?: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

export interface CreateAskRequest {
  personId: string;
  description: string;
  parentId?: string;
}

export interface CreateFavourRequest {
  personId: string;
  description: string;
  parentId?: string;
}

export interface UpdateAskRequest {
  description?: string;
  completed?: boolean;
  parentId?: string | null;
}

export interface UpdateFavourRequest {
  description?: string;
  completed?: boolean;
  parentId?: string | null;
}

export interface PeopleQueryParams {
  search?: string;
  tagIds?: string;
  limit?: number;
  offset?: number;
}
