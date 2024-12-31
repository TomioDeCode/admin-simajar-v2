import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Angkatan } from "@/types/angkatan";

interface UpdateModalProps {
  data: Angkatan;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: Angkatan) => Promise<void>;
}

export function UpdateModal({
  data,
  isOpen,
  onClose,
  onUpdate,
}: UpdateModalProps) {
  const [formData, setFormData] = useState<Angkatan>(data);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: keyof Angkatan, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "is_graduated" ? value === "true" : value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {Object.entries(formData)
              .filter(([key]) => key !== "id")
              .map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key.replace(/_/g, " ").toUpperCase()}
                  </Label>
                  {key === "is_graduated" ? (
                    <select
                      id={key}
                      value={String(value)}
                      onChange={(e) =>
                        handleInputChange(key as keyof Angkatan, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <Input
                      id={key}
                      type={key.includes("date") ? "date" : "text"}
                      value={String(value)}
                      onChange={(e) =>
                        handleInputChange(key as keyof Angkatan, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
