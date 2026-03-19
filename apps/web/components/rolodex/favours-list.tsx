'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FavourItem } from './favour-item';
import type { Favour } from '@lifeos/types';

interface FavoursListProps {
  favours: Favour[];
  onAdd: (description: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function FavoursList({ favours, onAdd, onToggle, onDelete }: FavoursListProps) {
  const [newFavour, setNewFavour] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newFavour.trim()) return;
    setIsAdding(true);
    try {
      await onAdd(newFavour.trim());
      setNewFavour('');
    } finally {
      setIsAdding(false);
    }
  };

  const pendingFavours = favours.filter((f) => !f.completed);
  const completedFavours = favours.filter((f) => f.completed);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Add a favour you did..."
          value={newFavour}
          onChange={(e) => setNewFavour(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          disabled={isAdding}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAdd}
          disabled={!newFavour.trim() || isAdding}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {pendingFavours.length > 0 && (
        <div className="space-y-2">
          {pendingFavours.map((favour) => (
            <FavourItem key={favour.id} favour={favour} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}

      {completedFavours.length > 0 && (
        <div className="space-y-2 opacity-60">
          <p className="text-xs text-muted-foreground">Completed</p>
          {completedFavours.map((favour) => (
            <FavourItem key={favour.id} favour={favour} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}

      {favours.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No favours yet</p>
      )}
    </div>
  );
}
