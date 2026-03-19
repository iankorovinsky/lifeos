'use client';

import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Favour } from '@lifeos/types';

interface FavourItemProps {
  favour: Favour;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function FavourItem({ favour, onToggle, onDelete }: FavourItemProps) {
  return (
    <div className="group flex items-center gap-2">
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
