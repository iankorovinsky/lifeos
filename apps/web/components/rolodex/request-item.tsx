'use client';

import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Request } from '@lifeos/types';

interface RequestItemProps {
  request: Request;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RequestItem({ request, onToggle, onDelete }: RequestItemProps) {
  return (
    <div className="group flex items-center gap-2">
      <Checkbox
        checked={request.completed}
        onCheckedChange={(checked) => onToggle(request.id, checked as boolean)}
      />
      <span
        className={`flex-1 text-sm ${request.completed ? 'line-through text-muted-foreground' : ''}`}
      >
        {request.description}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={() => onDelete(request.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
