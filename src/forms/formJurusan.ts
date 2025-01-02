import { FormField } from "@/types/form";

export const formFields: FormField[] = [
  {
    id: "name",
    label: "Name",
    type: "text",
    required: true,
    min: 1,
  },
  {
    id: "abbreviation",
    label: "Abbreviation",
    type: "text",
    required: true,
    min: 1,
  },
];
