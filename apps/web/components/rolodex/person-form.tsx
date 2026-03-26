'use client';

import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatableMultiSelect } from '@/components/ui/creatable-multi-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Tag } from '@lifeos/types';

export type PersonFormValues = {
  firstName: string;
  lastName?: string;
  description?: string;
  phoneNumber?: string;
  linkedinUrl?: string;
  xUrl?: string;
  emails?: string[];
  isFavorite?: boolean;
  tagNames?: string[];
};

interface PersonFormProps {
  initialData?: {
    firstName?: string;
    lastName?: string;
    description?: string;
    phoneNumber?: string;
    linkedinUrl?: string;
    xUrl?: string;
    emails?: string[];
    isFavorite?: boolean;
    tagNames?: string[];
  };
  tags: Tag[];
  onSubmit: (data: PersonFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PersonForm({ initialData, tags, onSubmit, onCancel, isLoading }: PersonFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl || '');
  const [xUrl, setXUrl] = useState(initialData?.xUrl || '');
  const [emailsText, setEmailsText] = useState((initialData?.emails || []).join('\n'));
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);
  const [selectedTagNames, setSelectedTagNames] = useState(initialData?.tagNames || []);

  const tagOptions = useMemo(
    () =>
      tags
        .map((tag) => ({
          label: tag.name,
          value: tag.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [tags]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emails = emailsText
      .split(/[\n,]/)
      .map((email) => email.trim())
      .filter(Boolean);

    await onSubmit({
      firstName,
      lastName: lastName || undefined,
      description: description || undefined,
      phoneNumber: phoneNumber || undefined,
      linkedinUrl: linkedinUrl || undefined,
      xUrl: xUrl || undefined,
      emails: emails.length > 0 ? emails : undefined,
      isFavorite,
      tagNames: selectedTagNames.length > 0 ? selectedTagNames : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col bg-background">
      <div className="space-y-6 px-6 py-6">
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Identity</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">
                First name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How do you know this person?"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <Label htmlFor="favorite" className="flex items-center gap-2 text-sm font-medium">
              <Star
                className={cn(
                  'h-4 w-4',
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                )}
              />
              Favorite
            </Label>
            <Switch id="favorite" checked={isFavorite} onCheckedChange={setIsFavorite} />
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Contact</h3>

          <div className="space-y-2">
            <Label htmlFor="emails">Emails</Label>
            <Textarea
              id="emails"
              value={emailsText}
              onChange={(e) => setEmailsText(e.target.value)}
              placeholder={'john@example.com\njohn@work.com'}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">One per line or separated by commas.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone number</Label>
              <Input
                id="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin-url">LinkedIn</Label>
              <Input
                id="linkedin-url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="x-url">X</Label>
            <Input
              id="x-url"
              value={xUrl}
              onChange={(e) => setXUrl(e.target.value)}
              placeholder="https://x.com/johndoe"
            />
          </div>
        </section>

        <Separator />

        <section className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">Tags</h3>
            <p className="text-sm text-muted-foreground">
              Search existing tags or add a new one if it does not exist yet.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <CreatableMultiSelect
              options={tagOptions}
              values={selectedTagNames}
              onChange={setSelectedTagNames}
              placeholder="Search tags"
              searchPlaceholder="Search tags..."
              emptyText="No tags found."
              createLabel={(query) => `Add tag "${query}"`}
            />
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 mt-auto border-t bg-background px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">You can edit the details later.</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!firstName.trim() || isLoading}>
              {isLoading ? 'Saving...' : 'Save person'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
