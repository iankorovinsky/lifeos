'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PersonCard } from '@/components/rolodex/person-card';
import { PersonForm } from '@/components/rolodex/person-form';
import { TagChip } from '@/components/rolodex/tag-chip';
import { getPeople, getTags, createPerson } from '@/lib/rolodex/api';
import type { Person, Tag, CreatePersonRequest } from '@lifeos/types';

export default function RolodexPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [peopleData, tagsData] = await Promise.all([getPeople(), getTags()]);
      setPeople(peopleData);
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPeople = useMemo(() => {
    let result = people;

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.roles?.some(
            (r) => r.title.toLowerCase().includes(query) || r.company?.toLowerCase().includes(query)
          )
      );
    }

    // Filter by tags
    if (selectedTagIds.length > 0) {
      result = result.filter((p) => p.tags?.some((t) => selectedTagIds.includes(t.id)));
    }

    // Sort: favorites first, then by name
    result = [...result].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [people, search, selectedTagIds]);

  const handleCreatePerson = async (data: CreatePersonRequest) => {
    setIsCreating(true);
    try {
      const newPerson = await createPerson(data);
      setPeople((prev) => [...prev, newPerson]);
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Failed to create person:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleTagFilter = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTagIds([]);
  };

  const hasFilters = search.trim() || selectedTagIds.length > 0;

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Rolodex</h1>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Person</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <PersonForm
                  tags={tags}
                  onSubmit={handleCreatePerson}
                  onCancel={() => setIsSheetOpen(false)}
                  isLoading={isCreating}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTagFilter(tag.id)}
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
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        {/* People List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredPeople.length > 0 ? (
          <div className="space-y-3">
            {filteredPeople.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {hasFilters
                ? 'No people match your filters'
                : 'No people yet. Add someone to get started!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
