import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormModal, FormField } from "@/components/elements/FormModal";
import { DeleteModal } from "@/components/commons/DeleteModal";
import { Angkatan } from "@/types/angkatan";

interface TableActionsProps {
  row: Angkatan;
  onUpdate: (data: Angkatan) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TableActions({ row, onUpdate, onDelete }: TableActionsProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formFields: FormField[] = [
    {
      id: "number",
      label: "Number",
      type: "number",
      required: true,
      min: 1,
    },
    {
      id: "start_date",
      label: "Start Date",
      type: "date",
      required: true,
    },
    {
      id: "end_date",
      label: "End Date",
      type: "date",
      required: true,
    },
    {
      id: "is_graduated",
      label: "Graduated",
      type: "checkbox",
    },
  ];

  const handleUpdate = async (data: Partial<Angkatan>) => {
    await onUpdate({
      ...data,
      id: row.id,
    } as Angkatan);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setShowUpdateModal(true);
          console.log(row);
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
