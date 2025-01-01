import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormModal, FormField } from "@/components/elements/FormModal";

interface CreateModalProps<T> {
  onSubmit: (data: Omit<T, "id">) => Promise<void>;
  initialData: Partial<T>;
  title: string;
  fields: FormField[];
}

export function CreateModal<T extends { id?: string }>({
  onSubmit,
  initialData = {} as Partial<T>,
  title,
  fields,
}: CreateModalProps<T>) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (data: Partial<T>) => {
    const { id, ...submitData } = data as T;
    await onSubmit(submitData);
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Create Generation</Button>
      <FormModal
        title={title}
        fields={fields}
        initialData={initialData}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
