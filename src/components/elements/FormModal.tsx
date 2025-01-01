import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

export interface FormField {
  id: string;
  label: string;
  type:
    | "text"
    | "email"
    | "select"
    | "textarea"
    | "radio"
    | "checkbox"
    | "date"
    | "number"
    | "tel"
    | "password";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  rows?: number;
  min?: number;
  max?: number;
}

interface FormModalProps<T> {
  title: string;
  fields: FormField[];
  initialData?: Partial<T>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
}

export function FormModal<T>({
  title,
  fields,
  initialData = {},
  isOpen,
  onClose,
  onSubmit,
}: FormModalProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  const getFieldValue = (field: FormField) => {
    const value = formData[field.id as keyof T];

    if (value === undefined) {
      return field.type === "checkbox" ? false : "";
    }

    if (field.type === "date" && value) {
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.split("T")[0];
      }

      try {
        const date = new Date(value as string);
        if (!isNaN(date.getTime())) {
          return format(date, "yyyy-MM-dd");
        }
      } catch (error) {
        console.error("Date parsing error:", error);
      }
      return "";
    }

    return value;
  };

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => {
      let newValue = value;

      if (fields.find((f) => f.id === id)?.type === "date") {
        newValue = value ? new Date(value).toISOString() : null;
      }

      return {
        ...prev,
        [id]: newValue,
      };
    });

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const processedData = { ...formData };
      fields.forEach((field) => {
        if (field.type === "date" && processedData[field.id as keyof T]) {
          const date = new Date(processedData[field.id as keyof T] as string);
          if (!isNaN(date.getTime())) {
            processedData[field.id as keyof T] = date.toISOString() as any;
          }
        }
      });

      const submissionData = {
        ...initialData,
        ...processedData,
      } as T;

      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = getFieldValue(field);

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.rows || 3}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );

      case "select":
        return (
          <Select
            value={value as string}
            onValueChange={(newValue) => handleChange(field.id, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={(newValue) => handleChange(field.id, newValue)}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.id}-${option.value}`}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value as boolean}
              onCheckedChange={(checked) => handleChange(field.id, checked)}
            />
          </div>
        );

      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            required={field.required}
            value={value as string}
            onChange={(e) => {
              const date = e.target.value;
              handleChange(field.id, date);
            }}
          />
        );

      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-sm text-red-500">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
