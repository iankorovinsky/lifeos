'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
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

function FavourItem({
  favour,
  onToggle,
  onDelete,
}: {
  favour: Favour;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div className="flex items-center gap-2 group">
      <Checkbox
        checked={favour.completed}
        onCheckedChange={(checked) => onToggle(favour.id, checked as boolean)}
      />
      <span
        className={`flex-1 text-sm ${favour.completed ? 'line-through text-muted-foreground' : ''}`}
      >
        {favour.description}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={() => onDelete(favour.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
