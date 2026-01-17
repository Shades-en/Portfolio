import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface ConfirmDialogProps {
  readonly trigger: React.ReactNode;
  readonly title: string;
  readonly description?: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  open,
  onOpenChange,
}) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-[70]" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[hsl(var(--secondary))] backdrop-blur-sm border border-primary/20 rounded-lg shadow-lg z-[80] w-full max-w-sm p-5">
          <AlertDialog.Title className="text-white text-base mb-1">{title}</AlertDialog.Title>
          {description && (
            <AlertDialog.Description className="text-slate-400 text-sm mb-4">
              {description}
            </AlertDialog.Description>
          )}
          <div className="flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button className="px-3 py-1.5 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800">
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-500"
              >
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ConfirmDialog;
