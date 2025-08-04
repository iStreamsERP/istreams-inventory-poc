import AutoSuggestInput from "@/components/common/AutoSuggestInput";
import Dropdown from "@/components/common/Dropdown";
import TextInput from "@/components/common/TextInput";

interface FieldConfig {
  type: "text" | "autoSuggest" | "dropdown";
  label: string;
  name: string;
  options?: string[];
  suggestions?: string[];
}

interface EmployeeCardProps {
  fields: FieldConfig[];
}

export default function EmployeeCard({ fields }: EmployeeCardProps) {
  return (
    <div className="border rounded-md p-2 mb-2">
      <h2 className="text-sm font-medium mb-2">Employee Details:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          switch (field.type) {
            case "text":
              return (
                <TextInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value=""
                  onChange={() => {}}
                />
              );
            case "autoSuggest":
              return (
                <AutoSuggestInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  suggestions={field.suggestions || []}
                />
              );
            case "dropdown":
              return (
                <Dropdown
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  options={field.options || []}
                  placeholder="Select"
                  value=""
                  onChange={() => {}}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
