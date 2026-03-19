'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTags, createTag, updateTag, deleteTag } from '@/lib/rolodex/api';
import type { Tag } from '@lifeos/types';

export default function RolodexTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#94a3b8');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#94a3b8');

  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true);
      try {
        setTags(await getTags());
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) {
      return;
    }

    const tag = await createTag({
      name: newName.trim(),
      color: newColor,
    });
    setTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName('');
    setNewColor('#94a3b8');
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color || '#94a3b8');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('#94a3b8');
  };

  const handleSave = async (id: string) => {
    const updated = await updateTag(id, {
      name: editName.trim(),
      color: editColor,
    });
    setTags((prev) => prev.map((tag) => (tag.id === id ? updated : tag)).sort((a, b) => a.name.localeCompare(b.name)));
    cancelEdit();
  };

  const handleDelete = async (id: string) => {
    await deleteTag(id);
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/app/rolodex">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Tags</h1>
            <p className="text-sm text-muted-foreground">Manage rolodex labels and colors.</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-3 text-sm font-medium">Create tag</h2>
          <div className="grid grid-cols-[1fr_auto_auto] gap-2">
            <Input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Tag name" />
            <Input
              type="color"
              value={newColor}
              onChange={(event) => setNewColor(event.target.value)}
              className="w-14 p-1"
            />
            <Button onClick={handleCreate} disabled={!newName.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : tags.length > 0 ? (
          <div className="space-y-3">
            {tags.map((tag) => {
              const isEditing = editingId === tag.id;

              return (
                <div key={tag.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: (isEditing ? editColor : tag.color) || '#cbd5e1' }}
                  />

                  {isEditing ? (
                    <>
                      <Input value={editName} onChange={(event) => setEditName(event.target.value)} className="flex-1" />
                      <Input
                        type="color"
                        value={editColor}
                        onChange={(event) => setEditColor(event.target.value)}
                        className="w-14 p-1"
                      />
                      <Button size="icon" onClick={() => handleSave(tag.id)} disabled={!editName.trim()}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-medium">{tag.name}</p>
                        <p className="text-xs text-muted-foreground">{tag.color || 'No color set'}</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(tag)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(tag.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tags yet.</p>
        )}
      </div>
    </div>
  );
}
