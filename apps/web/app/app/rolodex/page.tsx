'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AddPersonSheet } from '@/components/rolodex/add-person-sheet';
import { PersonCard } from '@/components/rolodex/person-card';
import { TagFilter } from '@/components/rolodex/tag-filter';
import { getPeople, getTags } from '@/lib/rolodex/api';
import type { Person, Tag } from '@lifeos/types';

export default function RolodexPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          [p.firstName, p.lastName].filter(Boolean).join(' ').toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.phoneNumber?.toLowerCase().includes(query) ||
          p.linkedinUrl?.toLowerCase().includes(query) ||
          p.xUrl?.toLowerCase().includes(query) ||
          p.emails?.some((email) => email.email.toLowerCase().includes(query)) ||
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
      return [a.firstName, a.lastName]
        .filter(Boolean)
        .join(' ')
        .localeCompare([b.firstName, b.lastName].filter(Boolean).join(' '));
    });

    return result;
  }, [people, search, selectedTagIds]);

  const handlePersonCreated = (person: Person) => {
    setPeople((prev) => [...prev, person]);
    setTags((prev) => {
      const nextTags = new Map(prev.map((tag) => [tag.id, tag]));
      person.tags.forEach((tag) => nextTags.set(tag.id, tag));
      return Array.from(nextTags.values()).sort((a, b) => a.name.localeCompare(b.name));
    });
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
          <div className="flex items-center gap-2">
            <AddPersonSheet tags={tags} onPersonCreated={handlePersonCreated} />
          </div>
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

          <TagFilter
            tags={tags}
            selectedTagIds={selectedTagIds}
            onToggle={toggleTagFilter}
            onClear={clearFilters}
          />
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
