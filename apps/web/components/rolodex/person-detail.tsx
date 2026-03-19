'use client';

import { useCallback, useState } from 'react';
import { ArrowLeft, Building, Mail, Pencil, Phone, Save, Star, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { AsksList } from './asks-list';
import { FavoursList } from './favours-list';
import { PersonNotes } from './person-notes';
import { RoleForm } from './role-form';
import { TagChip } from './tag-chip';
import type { Ask, Favour, Person, PersonNote, RoleInput, Tag, UpdatePersonRequest } from '@lifeos/types';

interface PersonDetailProps {
  person: Person;
  tags: Tag[];
  onBack: () => void;
  onUpdate: (data: UpdatePersonRequest) => Promise<Person>;
  onDelete: () => Promise<void>;
  onAddAsk: (description: string) => Promise<void>;
  onToggleAsk: (id: string, completed: boolean) => Promise<void>;
  onDeleteAsk: (id: string) => Promise<void>;
  onAddFavour: (description: string) => Promise<void>;
  onToggleFavour: (id: string, completed: boolean) => Promise<void>;
  onDeleteFavour: (id: string) => Promise<void>;
  onAddNote: (content: string) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

export function PersonDetail({
  person,
  tags,
  onBack,
  onUpdate,
  onDelete,
  onAddAsk,
  onToggleAsk,
  onDeleteAsk,
  onAddFavour,
  onToggleFavour,
  onDeleteFavour,
  onAddNote,
  onDeleteNote,
}: PersonDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState(person.name);
  const [editDescription, setEditDescription] = useState(person.description || '');
  const [editEmail, setEditEmail] = useState(person.email || '');
  const [editPhone, setEditPhone] = useState(person.phone || '');
  const [editRoles, setEditRoles] = useState<RoleInput[]>(
    person.roles.map((role) => ({ title: role.title, company: role.company || '' }))
  );
  const [editTagIds, setEditTagIds] = useState<string[]>(person.tags.map((tag) => tag.id));

  const resetEditState = useCallback(() => {
    setEditName(person.name);
    setEditDescription(person.description || '');
    setEditEmail(person.email || '');
    setEditPhone(person.phone || '');
    setEditRoles(person.roles.map((role) => ({ title: role.title, company: role.company || '' })));
    setEditTagIds(person.tags.map((tag) => tag.id));
  }, [person]);

  const toggleEditTag = (tagId: string) => {
    setEditTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({
        name: editName.trim(),
        description: editDescription || undefined,
        email: editEmail || undefined,
        phone: editPhone || undefined,
        roles: editRoles,
        tagIds: editTagIds,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    resetEditState();
    setIsEditing(false);
  };

  const handleToggleFavorite = async () => {
    await onUpdate({ isFavorite: !person.isFavorite });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this person?')) {
      return;
    }

    await onDelete();
  };

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            {isEditing ? (
              <Input value={editName} onChange={(event) => setEditName(event.target.value)} className="text-xl font-semibold" />
            ) : (
              <h1 className="text-2xl font-semibold">{person.name}</h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
              <Star className={`h-4 w-4 ${person.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>

            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={handleSave} disabled={isSaving || !editName.trim()}>
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

        <div className="mb-6 space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  placeholder="How do you know this person?"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editPhone}
                    onChange={(event) => setEditPhone(event.target.value)}
                    placeholder="+1 555 123 4567"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {person.description ? <p className="text-muted-foreground">{person.description}</p> : null}

              <div className="flex flex-wrap gap-4 text-sm">
                {person.email ? (
                  <a href={`mailto:${person.email}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Mail className="h-4 w-4" />
                    {person.email}
                  </a>
                ) : null}
                {person.phone ? (
                  <a href={`tel:${person.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Phone className="h-4 w-4" />
                    {person.phone}
                  </a>
                ) : null}
              </div>
            </>
          )}
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-sm font-medium">Roles</h2>
          {isEditing ? (
            <RoleForm roles={editRoles} onChange={setEditRoles} />
          ) : person.roles.length > 0 ? (
            <div className="space-y-2">
              {person.roles.map((role) => (
                <div key={role.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>
                    {role.title}
                    {role.company ? ` @ ${role.company}` : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">No roles</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-sm font-medium">Tags</h2>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag.id} type="button" onClick={() => toggleEditTag(tag.id)} className="focus:outline-none">
                  <TagChip tag={{ ...tag, color: editTagIds.includes(tag.id) ? tag.color : null }} />
                </button>
              ))}
            </div>
          ) : person.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {person.tags.map((tag) => (
                <TagChip key={tag.id} tag={tag} />
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">No tags</p>
          )}
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h2 className="mb-3 text-sm font-medium">Notes</h2>
          <PersonNotes notes={person.notes || ([] as PersonNote[])} onAdd={onAddNote} onDelete={onDeleteNote} />
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h2 className="mb-3 text-sm font-medium">Asks (things you asked for)</h2>
          <AsksList asks={person.asks || ([] as Ask[])} onAdd={onAddAsk} onToggle={onToggleAsk} onDelete={onDeleteAsk} />
        </div>

        <Separator className="my-6" />

        <div>
          <h2 className="mb-3 text-sm font-medium">Favours (things you did for them)</h2>
          <FavoursList
            favours={person.favours || ([] as Favour[])}
            onAdd={onAddFavour}
            onToggle={onToggleFavour}
            onDelete={onDeleteFavour}
          />
        </div>
      </div>
    </div>
  );
}
