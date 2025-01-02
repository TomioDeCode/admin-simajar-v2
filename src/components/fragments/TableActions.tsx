import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormModal } from "@/components/elements/FormModal";
import { DeleteModal } from "@/components/commons/DeleteModal";
import { FormField } from "@/types/form";

interface BaseRecord {
  id: string | number;
}

interface TableActionsProps<T extends BaseRecord> {
  row: T;
  formFields: FormField[];
  title: string;
  onUpdate: (data: Partial<T>) => Promise<void>;
  onDelete: (id: T["id"]) => Promise<void>;
  updateButtonLabel?: string;
  deleteButtonLabel?: string;
  hideUpdate?: boolean;
  hideDelete?: boolean;
  formatData?: (data: Partial<T>) => Partial<T>;
}

export function TableActions<T extends BaseRecord>({
  row,
  formFields,
  title,
  onUpdate,
  onDelete,
  updateButtonLabel = "Update",
  deleteButtonLabel = "Delete",
  hideUpdate = false,
  hideDelete = false,
  formatData,
}: TableActionsProps<T>) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = async (data: Partial<T>) => {
    const formattedData = {
      ...data,
      id: row.id,
    };

    const finalData = formatData ? formatData(formattedData) : formattedData;

    await onUpdate(finalData);
    setShowUpdateModal(false);
  };

  return (
    <div className="flex items-center gap-2">
      {!hideUpdate && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUpdateModal(true)}
        >
          {updateButtonLabel}
        </Button>
      )}

      {!hideDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
        >
          {deleteButtonLabel}
        </Button>
      )}

      <FormModal
        title={title}
        fields={formFields}
        initialData={row}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={handleUpdate}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(row.id)}
      />
    </div>
  );
}
