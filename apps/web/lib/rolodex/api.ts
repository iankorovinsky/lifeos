import type {
  Person,
  Tag,
  Ask,
  Favour,
  CreatePersonRequest,
  UpdatePersonRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreateAskRequest,
  UpdateAskRequest,
  CreateFavourRequest,
  UpdateFavourRequest,
  PeopleQueryParams,
} from '@lifeos/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// People
export async function getPeople(params?: PeopleQueryParams): Promise<Person[]> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.tagIds) searchParams.set('tagIds', params.tagIds);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  return fetchApi<Person[]>(`/api/rolodex/people${query ? `?${query}` : ''}`);
}

export async function getPersonById(id: string): Promise<Person> {
  return fetchApi<Person>(`/api/rolodex/people/${id}`);
}

export async function createPerson(data: CreatePersonRequest): Promise<Person> {
  return fetchApi<Person>('/api/rolodex/people', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePerson(id: string, data: UpdatePersonRequest): Promise<Person> {
  return fetchApi<Person>(`/api/rolodex/people/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePerson(id: string): Promise<void> {
  await fetchApi(`/api/rolodex/people/${id}`, { method: 'DELETE' });
}

// Tags
export async function getTags(): Promise<Tag[]> {
  return fetchApi<Tag[]>('/api/rolodex/tags');
}

export async function createTag(data: CreateTagRequest): Promise<Tag> {
  return fetchApi<Tag>('/api/rolodex/tags', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTag(id: string, data: UpdateTagRequest): Promise<Tag> {
  return fetchApi<Tag>(`/api/rolodex/tags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTag(id: string): Promise<void> {
  await fetchApi(`/api/rolodex/tags/${id}`, { method: 'DELETE' });
}

// Asks
export async function getAsks(personId?: string): Promise<Ask[]> {
  const query = personId ? `?personId=${personId}` : '';
  return fetchApi<Ask[]>(`/api/rolodex/asks${query}`);
}

export async function createAsk(data: CreateAskRequest): Promise<Ask> {
  return fetchApi<Ask>('/api/rolodex/asks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAsk(id: string, data: UpdateAskRequest): Promise<Ask> {
  return fetchApi<Ask>(`/api/rolodex/asks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAsk(id: string): Promise<void> {
  await fetchApi(`/api/rolodex/asks/${id}`, { method: 'DELETE' });
}

// Favours
export async function getFavours(personId?: string): Promise<Favour[]> {
  const query = personId ? `?personId=${personId}` : '';
  return fetchApi<Favour[]>(`/api/rolodex/favours${query}`);
}

export async function createFavour(data: CreateFavourRequest): Promise<Favour> {
  return fetchApi<Favour>('/api/rolodex/favours', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateFavour(id: string, data: UpdateFavourRequest): Promise<Favour> {
  return fetchApi<Favour>(`/api/rolodex/favours/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteFavour(id: string): Promise<void> {
  await fetchApi(`/api/rolodex/favours/${id}`, { method: 'DELETE' });
}
