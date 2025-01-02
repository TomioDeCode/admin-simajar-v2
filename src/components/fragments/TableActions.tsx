import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormModal, FormField } from "@/components/elements/FormModal";
import { DeleteModal } from "@/components/commons/DeleteModal";
import { Angkatan } from "@/types/angkatan";
import { formFields, formFieldsUpdate } from "@/forms/formAngkatan";

interface TableActionsProps {
  row: Angkatan;
  onUpdate: (data: Angkatan) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TableActions({ row, onUpdate, onDelete }: TableActionsProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = async (data: Partial<Angkatan>) => {
    await onUpdate({
      ...data,
      id: row.id,
    } as Angkatan);
    setShowUpdateModal(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setShowUpdateModal(true);
        }}
      >
        Update
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setShowDeleteModal(true);
        }}
      >
        Delete
      </Button>
      <FormModal
        title="Update Generation"
        fields={formFieldsUpdate}
        initialData={row}
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
        }}
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
