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

type PersonFieldInputs = Pick<Person, 'name' | 'description' | 'email' | 'phone' | 'isFavorite'>;

export type CreatePersonRequest = {
  name: PersonFieldInputs['name'];
  description?: PersonFieldInputs['description'];
  email?: PersonFieldInputs['email'];
  phone?: PersonFieldInputs['phone'];
  isFavorite?: PersonFieldInputs['isFavorite'];
  tagIds?: string[];
};

export type UpdatePersonRequest = {
  name?: PersonFieldInputs['name'];
  description?: PersonFieldInputs['description'];
  email?: PersonFieldInputs['email'];
  phone?: PersonFieldInputs['phone'];
  isFavorite?: PersonFieldInputs['isFavorite'];
  tagIds?: string[];
};

export type CreateRoleRequest = {
  personId: Role['personId'];
  title: Role['title'];
  company?: Role['company'];
};

export type CreateTagRequest = {
  name: Tag['name'];
  color?: Tag['color'];
};

export type UpdateTagRequest = {
  name?: Tag['name'];
  color?: Tag['color'];
};

export type CreateAskRequest = {
  personId: Ask['personId'];
  description: Ask['description'];
  parentId?: Ask['parentId'];
};

export type CreateFavourRequest = {
  personId: Favour['personId'];
  description: Favour['description'];
  parentId?: Favour['parentId'];
};

export type UpdateAskRequest = {
  description?: Ask['description'];
  completed?: Ask['completed'];
  parentId?: Ask['parentId'];
};

export type UpdateFavourRequest = {
  description?: Favour['description'];
  completed?: Favour['completed'];
  parentId?: Favour['parentId'];
};

export interface PeopleQueryParams {
  search?: string;
  tagIds?: string;
  limit?: number;
  offset?: number;
}
