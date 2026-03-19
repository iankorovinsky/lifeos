'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PersonDetail } from '@/components/rolodex/person-detail';
import { Button } from '@/components/ui/button';
import {
  createAsk,
  createFavour,
  createNote,
  deleteAsk,
  deleteFavour,
  deleteNote,
  deletePerson,
  getPersonById,
  getTags,
  updateAsk,
  updateFavour,
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

  const handleAddAsk = async (description: string) => {
    const newAsk = await createAsk({ personId: id, description });
    setPerson((prev) => (prev ? { ...prev, asks: [...(prev.asks || []), newAsk] } : null));
  };

  const handleToggleAsk = async (askId: string, completed: boolean) => {
    const updated = await updateAsk(askId, { completed });
    setPerson((prev) =>
      prev ? { ...prev, asks: prev.asks.map((ask) => (ask.id === askId ? updated : ask)) } : null
    );
  };

  const handleDeleteAsk = async (askId: string) => {
    await deleteAsk(askId);
    setPerson((prev) =>
      prev ? { ...prev, asks: prev.asks.filter((ask) => ask.id !== askId) } : null
    );
  };

  const handleAddFavour = async (description: string) => {
    const newFavour = await createFavour({ personId: id, description });
    setPerson((prev) => (prev ? { ...prev, favours: [...(prev.favours || []), newFavour] } : null));
  };

  const handleToggleFavour = async (favourId: string, completed: boolean) => {
    const updated = await updateFavour(favourId, { completed });
    setPerson((prev) =>
      prev
        ? {
            ...prev,
            favours: prev.favours.map((favour) => (favour.id === favourId ? updated : favour)),
          }
        : null
    );
  };

  const handleDeleteFavour = async (favourId: string) => {
    await deleteFavour(favourId);
    setPerson((prev) =>
      prev ? { ...prev, favours: prev.favours.filter((favour) => favour.id !== favourId) } : null
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
      onAddAsk={handleAddAsk}
      onToggleAsk={handleToggleAsk}
      onDeleteAsk={handleDeleteAsk}
      onAddFavour={handleAddFavour}
      onToggleFavour={handleToggleFavour}
      onDeleteFavour={handleDeleteFavour}
      onAddNote={handleAddNote}
      onDeleteNote={handleDeleteNote}
    />
  );
}
