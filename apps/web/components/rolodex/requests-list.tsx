'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RequestItem } from './request-item';
import type { Request, RequestType } from '@lifeos/types';

interface RequestsListProps {
  requests: Request[];
  type: RequestType;
  placeholder: string;
  emptyMessage: string;
  onAdd: (description: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RequestsList({
  requests,
  type,
  placeholder,
  emptyMessage,
  onAdd,
  onToggle,
  onDelete,
}: RequestsListProps) {
  const [newRequest, setNewRequest] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newRequest.trim()) return;
    setIsAdding(true);
    try {
      await onAdd(newRequest.trim());
      setNewRequest('');
    } finally {
      setIsAdding(false);
    }
  };

  const filteredRequests = requests.filter((r) => r.type === type);
  const pendingRequests = filteredRequests.filter((r) => !r.completed);
  const completedRequests = filteredRequests.filter((r) => r.completed);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newRequest}
          onChange={(e) => setNewRequest(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          disabled={isAdding}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAdd}
          disabled={!newRequest.trim() || isAdding}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-2">
          {pendingRequests.map((request) => (
            <RequestItem
              key={request.id}
              request={request}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {completedRequests.length > 0 && (
        <div className="space-y-2 opacity-60">
          <p className="text-xs text-muted-foreground">Completed</p>
          {completedRequests.map((request) => (
            <RequestItem
              key={request.id}
              request={request}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {filteredRequests.length === 0 && (
        <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
      )}
    </div>
  );
}
