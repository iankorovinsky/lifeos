'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AskItem } from './ask-item';
import type { Ask } from '@lifeos/types';

interface AsksListProps {
  asks: Ask[];
  onAdd: (description: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function AsksList({ asks, onAdd, onToggle, onDelete }: AsksListProps) {
  const [newAsk, setNewAsk] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newAsk.trim()) return;
    setIsAdding(true);
    try {
      await onAdd(newAsk.trim());
      setNewAsk('');
    } finally {
      setIsAdding(false);
    }
  };

  const pendingAsks = asks.filter((a) => !a.completed);
  const completedAsks = asks.filter((a) => a.completed);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Add something you asked for..."
          value={newAsk}
          onChange={(e) => setNewAsk(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          disabled={isAdding}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAdd}
          disabled={!newAsk.trim() || isAdding}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {pendingAsks.length > 0 && (
        <div className="space-y-2">
          {pendingAsks.map((ask) => (
            <AskItem key={ask.id} ask={ask} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}

      {completedAsks.length > 0 && (
        <div className="space-y-2 opacity-60">
          <p className="text-xs text-muted-foreground">Completed</p>
          {completedAsks.map((ask) => (
            <AskItem key={ask.id} ask={ask} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}

      {asks.length === 0 && <p className="text-sm text-muted-foreground italic">No asks yet</p>}
    </div>
  );
}
