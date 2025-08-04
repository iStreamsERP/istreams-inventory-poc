export interface FieldConfig {
  type: "text" | "date" | "autoSuggest" | "dropdown" | "upload" | "checkbox";
  label: string;
  name: string;
  dbField: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  suggestions?: string[] | (() => Promise<string[]>); // Support dynamic suggestions
  options?: string[];
  checked?: boolean;
  validationRules?: {
    regex?: RegExp;
    errorMessage?: string;
    maxLength?: number;
    minLength?: number;
  };
}

export interface SectionConfig {
  title: string;
  fields: FieldConfig[];
  renderAs?: "default" | "employeeCard"; // To specify rendering style
}

export interface FormSchema {
  title: string;
  sections: Record<string, SectionConfig>;
}

export const materialIssueNoteSchema: FormSchema = {
  title: "Material Issue Note",
  sections: {
    documentSection: {
      title: "Document Details",
      fields: [
        {
          type: "date",
          label: "Month Closing",
          name: "monthClosing",
          dbField: "MONTH_CLOSING",
          required: true,
        },
        {
          type: "text",
          label: "Document No",
          name: "documentNo",
          dbField: "DOCUMENT_NO",
          required: true,
          validationRules: {
            maxLength: 20,
            errorMessage: "Document No cannot exceed 20 characters",
          },
        },
        {
          type: "date",
          label: "Document Date",
          name: "documentDate",
          dbField: "DOCUMENT_DATE",
          required: true,
        },
      ],
    },
    projectSection: {
      title: "Project Details",
      fields: [
        {
          type: "text",
          label: "Project No",
          name: "projectNo",
          dbField: "PROJECT_NO",
          required: true,
        },
        {
          type: "text",
          label: "Project Name",
          name: "projectName",
          dbField: "PROJECT_NAME",
        },
        {
          type: "text",
          label: "BOQ No",
          name: "boqNo",
          dbField: "BOQ_NO",
        },
        {
          type: "text",
          label: "BOQ Name",
          name: "boqName",
          dbField: "BOQ_NAME",
        },
      ],
    },
    employeeSection: {
      title: "Employee Details",
      renderAs: "employeeCard",
      fields: [
        {
          type: "autoSuggest",
          label: "Emp No",
          name: "empNo",
          dbField: "EMP_NO",
          suggestions: async () => {
            // Simulate API call
            return ["E101", "E102", "E103"];
          },
          required: true,
        },
        {
          type: "text",
          label: "Emp Name",
          name: "empName",
          dbField: "EMP_NAME",
          required: true,
        },
      ],
    },
  },
};