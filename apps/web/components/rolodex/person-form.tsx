'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RoleForm } from './role-form';
import { TagChip } from './tag-chip';
import { Plus, Star } from 'lucide-react';
import type { Tag, CreatePersonRequest, RoleInput } from '@lifeos/types';

interface PersonFormProps {
  initialData?: {
    name?: string;
    description?: string;
    email?: string;
    phone?: string;
    isFavorite?: boolean;
    roles?: RoleInput[];
    tagIds?: string[];
  };
  tags: Tag[];
  onSubmit: (data: CreatePersonRequest) => Promise<void>;
  onCancel: () => void;
  onCreateTag?: (data: { name: string; color?: string }) => Promise<Tag>;
  isLoading?: boolean;
}

export function PersonForm({
  initialData,
  tags,
  onSubmit,
  onCancel,
  onCreateTag,
  isLoading,
}: PersonFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);
  const [roles, setRoles] = useState<RoleInput[]>(initialData?.roles || []);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tagIds || []);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#94a3b8');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      description: description || undefined,
      email: email || undefined,
      phone: phone || undefined,
      isFavorite,
      roles,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    if (!onCreateTag || !newTagName.trim()) {
      return;
    }

    setIsCreatingTag(true);
    try {
      const tag = await onCreateTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      setSelectedTagIds((prev) => (prev.includes(tag.id) ? prev : [...prev, tag.id]));
      setNewTagName('');
      setNewTagColor('#94a3b8');
    } finally {
      setIsCreatingTag(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="How do you know this person?"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="favorite" checked={isFavorite} onCheckedChange={setIsFavorite} />
        <Label htmlFor="favorite" className="flex items-center gap-1 cursor-pointer">
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          Favorite
        </Label>
      </div>

      <div className="space-y-2">
        <Label>Roles</Label>
        <RoleForm roles={roles} onChange={setRoles} />
      </div>

      {tags.length > 0 && (
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className="focus:outline-none"
              >
                <TagChip
                  tag={{
                    ...tag,
                    color: selectedTagIds.includes(tag.id) ? tag.color : null,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {onCreateTag ? (
        <div className="space-y-2">
          <Label>Create tag</Label>
          <div className="grid grid-cols-[1fr_auto_auto] gap-2">
            <Input
              value={newTagName}
              onChange={(event) => setNewTagName(event.target.value)}
              placeholder="Tag name"
            />
            <Input
              type="color"
              value={newTagColor}
              onChange={(event) => setNewTagColor(event.target.value)}
              className="w-14 p-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || isCreatingTag}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim() || isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
