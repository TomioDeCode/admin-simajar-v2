import { FormField } from "@/types/form";

export const formFields: FormField[] = [
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
