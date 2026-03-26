'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PersonDetail } from '@/components/rolodex/person-detail';
import { Button } from '@/components/ui/button';
import {
  createRequest,
  createNote,
  deleteRequest,
  deleteNote,
  deletePerson,
  getPersonById,
  getTags,
  updateRequest,
  updatePerson,
} from '@/lib/rolodex/api';
import type { Person, Tag, UpdatePersonRequest } from '@lifeos/types';

export default function PersonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [person, setPerson] = useState<Person | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [personData, tagsData] = await Promise.all([getPersonById(id), getTags()]);
      setPerson(personData);
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to load person:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdate = async (data: UpdatePersonRequest) => {
    const updated = await updatePerson(id, data);
    setPerson(updated);
    return updated;
  };

  const handleDelete = async () => {
    await deletePerson(id);
    router.push('/app/rolodex');
  };

  const handleAddRequest = async (description: string, type: 'ASK' | 'FAVOUR') => {
    const newRequest = await createRequest({ personId: id, type, description });
    setPerson((prev) =>
      prev ? { ...prev, requests: [...(prev.requests || []), newRequest] } : null
    );
  };

  const handleToggleRequest = async (requestId: string, completed: boolean) => {
    const updated = await updateRequest(requestId, { completed });
    setPerson((prev) =>
      prev
        ? {
            ...prev,
            requests: prev.requests.map((request) =>
              request.id === requestId ? updated : request
            ),
          }
        : null
    );
  };

  const handleDeleteRequest = async (requestId: string) => {
    await deleteRequest(requestId);
    setPerson((prev) =>
      prev
        ? { ...prev, requests: prev.requests.filter((request) => request.id !== requestId) }
        : null
    );
  };

  const handleAddNote = async (content: string) => {
    const note = await createNote({ personId: id, content });
    setPerson((prev) => (prev ? { ...prev, notes: [note, ...(prev.notes || [])] } : null));
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    setPerson((prev) =>
      prev ? { ...prev, notes: prev.notes.filter((note) => note.id !== noteId) } : null
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-2xl py-12 text-center">
          <p className="text-muted-foreground">Person not found</p>
          <Button variant="link" onClick={() => router.push('/app/rolodex')}>
            Back to Rolodex
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PersonDetail
      person={person}
      tags={tags}
      onBack={() => router.push('/app/rolodex')}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onAddRequest={handleAddRequest}
      onToggleRequest={handleToggleRequest}
      onDeleteRequest={handleDeleteRequest}
      onAddNote={handleAddNote}
      onDeleteNote={handleDeleteNote}
    />
  );
}
