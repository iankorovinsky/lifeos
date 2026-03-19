'use client';

import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Ask } from '@lifeos/types';

interface AskItemProps {
  ask: Ask;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function AskItem({ ask, onToggle, onDelete }: AskItemProps) {
  return (
    <div className="group flex items-center gap-2">
      <Checkbox
        checked={ask.completed}
        onCheckedChange={(checked) => onToggle(ask.id, checked as boolean)}
      />
      <span className={`flex-1 text-sm ${ask.completed ? 'line-through text-muted-foreground' : ''}`}>
        {ask.description}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={() => onDelete(ask.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
