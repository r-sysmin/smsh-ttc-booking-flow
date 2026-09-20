import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDataProvider } from '@/lib/data-provider';

interface DeleteEventTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTypeId: string;
  eventTypeName?: string;
  onDeleted?: () => void;
}

export function DeleteEventTypeDialog({
  open,
  onOpenChange,
  eventTypeId,
  eventTypeName,
  onDeleted,
}: DeleteEventTypeDialogProps) {
  const data = useDataProvider();
  const { mutate: deleteEventType } = data.useDeleteEventType();

  const title = eventTypeName
    ? `Delete "${eventTypeName}"?`
    : 'Delete this event type?';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            This event type and its booking link will be permanently removed.
            Existing bookings won't be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              deleteEventType(eventTypeId);
              onOpenChange(false);
              onDeleted?.();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
