import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/base/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { EventType } from '@/data/seed';

interface DetailEditProps {
  eventType: EventType;
  username: string;
  onSave: (fields: Partial<EventType>) => void;
  onDiscard: () => void;
  isSaving: boolean;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

export function DetailEdit({ eventType, username, onSave, onDiscard, isSaving }: DetailEditProps) {
  const [name, setName] = useState(eventType.name);
  const [slug, setSlug] = useState(eventType.slug);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(eventType.slug.length > 0);
  const [duration, setDuration] = useState(String(eventType.duration_minutes));
  const [description, setDescription] = useState(eventType.description ?? '');
  const [locationType, setLocationType] = useState<'conferencing' | 'in_person'>(
    eventType.location_type,
  );
  const [locationValue, setLocationValue] = useState(eventType.location_value ?? '');

  const effectiveSlug = useMemo(() => {
    if (slugManuallyEdited) return slug;
    return toSlug(name);
  }, [name, slug, slugManuallyEdited]);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(toSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(value);
  }

  function handleSave() {
    onSave({
      name,
      slug: effectiveSlug,
      duration_minutes: Number(duration),
      description: description || null,
      location_type: locationType,
      location_value: locationType === 'in_person' ? locationValue : null,
    });
  }

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(effectiveSlug);
  const canSave = name.trim().length > 0 && slugValid;

  return (
    <Card className="[&]:shadow-none">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="event-name">Event name</Label>
          <Input
            id="event-name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. 30-min Discovery Call"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url-slug">URL slug</Label>
          <Input
            id="url-slug"
            value={slugManuallyEdited ? slug : effectiveSlug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="e.g. discovery-call"
            aria-invalid={!slugValid}
          />
          <p className="text-sm text-muted-foreground">
            book/{username}/{effectiveSlug || '[slug]'}
          </p>
          {!slugValid && (
            <p className="text-sm text-destructive">
              Slug must contain only lowercase letters, numbers, and hyphens.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should guests know before booking?"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <RadioGroup
            value={locationType}
            onValueChange={(v) => setLocationType(v as 'conferencing' | 'in_person')}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="conferencing" id="loc-conferencing" />
              <Label htmlFor="loc-conferencing" className="font-normal">
                Conferencing link
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="in_person" id="loc-in-person" />
              <Label htmlFor="loc-in-person" className="font-normal">
                In person
              </Label>
            </div>
          </RadioGroup>
          {locationType === 'in_person' && (
            <Input
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              placeholder="Address or location…"
              className="mt-2"
            />
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!canSave || isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="ghost" onClick={onDiscard}>
            Discard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
