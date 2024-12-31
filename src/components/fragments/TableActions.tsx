import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UpdateModal } from "@/components/commons/UpdateModal";
import { DeleteModal } from "@/components/commons/DeleteModal";
import { Angkatan } from "@/types/angkatan";

interface TableActionsProps<T> {
  row: Angkatan;
  onUpdate: (data: Angkatan) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TableActions<T extends { id: string }>({
  row,
  onUpdate,
  onDelete,
}: TableActionsProps<T>) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowUpdateModal(true)}
      >
        Update
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteModal(true)}
      >
        Delete
      </Button>

      <UpdateModal
        data={row}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={onUpdate}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(row.id)}
      />
    </div>
  );
}
