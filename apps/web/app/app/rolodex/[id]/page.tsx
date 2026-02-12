'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star, Pencil, Trash2, Mail, Phone, Building, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TagChip } from '@/components/rolodex/tag-chip';
import { AsksList } from '@/components/rolodex/asks-list';
import { FavoursList } from '@/components/rolodex/favours-list';
import {
  getPersonById,
  getTags,
  updatePerson,
  deletePerson,
  createAsk,
  updateAsk,
  deleteAsk,
  createFavour,
  updateFavour,
  deleteFavour,
} from '@/lib/rolodex/api';
import type { Person, Tag } from '@lifeos/types';

export default function PersonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [person, setPerson] = useState<Person | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editTagIds, setEditTagIds] = useState<string[]>([]);

  const resetEditForm = useCallback((p: Person) => {
    setEditName(p.name);
    setEditDescription(p.description || '');
    setEditEmail(p.email || '');
    setEditPhone(p.phone || '');
    setEditTagIds(p.tags?.map((t) => t.id) || []);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [personData, tagsData] = await Promise.all([getPersonById(id), getTags()]);
      setPerson(personData);
      setTags(tagsData);
      resetEditForm(personData);
    } catch (error) {
      console.error('Failed to load person:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, resetEditForm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    if (!person) return;
    setIsSaving(true);
    try {
      const updated = await updatePerson(id, {
        name: editName,
        description: editDescription || undefined,
        email: editEmail || undefined,
        phone: editPhone || undefined,
        tagIds: editTagIds,
      });
      setPerson(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (person) resetEditForm(person);
    setIsEditing(false);
  };

  const handleToggleFavorite = async () => {
    if (!person) return;
    try {
      const updated = await updatePerson(id, { isFavorite: !person.isFavorite });
      setPerson(updated);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this person?')) return;
    try {
      await deletePerson(id);
      router.push('/app/rolodex');
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const toggleEditTag = (tagId: string) => {
    setEditTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // Ask handlers
  const handleAddAsk = async (description: string) => {
    const newAsk = await createAsk({ personId: id, description });
    setPerson((prev) => (prev ? { ...prev, asks: [...(prev.asks || []), newAsk] } : null));
  };

  const handleToggleAsk = async (askId: string, completed: boolean) => {
    const updated = await updateAsk(askId, { completed });
    setPerson((prev) =>
      prev ? { ...prev, asks: prev.asks?.map((a) => (a.id === askId ? updated : a)) || [] } : null
    );
  };

  const handleDeleteAsk = async (askId: string) => {
    await deleteAsk(askId);
    setPerson((prev) =>
      prev ? { ...prev, asks: prev.asks?.filter((a) => a.id !== askId) || [] } : null
    );
  };

  // Favour handlers
  const handleAddFavour = async (description: string) => {
    const newFavour = await createFavour({ personId: id, description });
    setPerson((prev) => (prev ? { ...prev, favours: [...(prev.favours || []), newFavour] } : null));
  };

  const handleToggleFavour = async (favourId: string, completed: boolean) => {
    const updated = await updateFavour(favourId, { completed });
    setPerson((prev) =>
      prev
        ? { ...prev, favours: prev.favours?.map((f) => (f.id === favourId ? updated : f)) || [] }
        : null
    );
  };

  const handleDeleteFavour = async (favourId: string) => {
    await deleteFavour(favourId);
    setPerson((prev) =>
      prev ? { ...prev, favours: prev.favours?.filter((f) => f.id !== favourId) || [] } : null
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-48 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-muted-foreground">Person not found</p>
          <Button variant="link" onClick={() => router.push('/app/rolodex')}>
            Back to Rolodex
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/app/rolodex')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xl font-semibold"
              />
            ) : (
              <h1 className="text-2xl font-semibold">{person.name}</h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
              <Star
                className={`h-4 w-4 ${person.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
              />
            </Button>

            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4 mb-6">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="How do you know this person?"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {person.description && <p className="text-muted-foreground">{person.description}</p>}

              <div className="flex flex-wrap gap-4 text-sm">
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    {person.email}
                  </a>
                )}
                {person.phone && (
                  <a
                    href={`tel:${person.phone}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {person.phone}
                  </a>
                )}
              </div>

              {person.roles && person.roles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {person.roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      <Building className="h-4 w-4" />
                      {role.title}
                      {role.company && ` @ ${role.company}`}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-2">Tags</h2>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleEditTag(tag.id)}
                  className="focus:outline-none"
                >
                  <TagChip
                    tag={{
                      ...tag,
                      color: editTagIds.includes(tag.id) ? tag.color : null,
                    }}
                  />
                </button>
              ))}
            </div>
          ) : person.tags && person.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {person.tags.map((tag) => (
                <TagChip key={tag.id} tag={tag} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No tags</p>
          )}
        </div>

        <Separator className="my-6" />

        {/* Asks */}
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3">Asks (things you asked for)</h2>
          <AsksList
            asks={person.asks || []}
            onAdd={handleAddAsk}
            onToggle={handleToggleAsk}
            onDelete={handleDeleteAsk}
          />
        </div>

        <Separator className="my-6" />

        {/* Favours */}
        <div>
          <h2 className="text-sm font-medium mb-3">Favours (things you did for them)</h2>
          <FavoursList
            favours={person.favours || []}
            onAdd={handleAddFavour}
            onToggle={handleToggleFavour}
            onDelete={handleDeleteFavour}
          />
        </div>
      </div>
    </div>
  );
}
