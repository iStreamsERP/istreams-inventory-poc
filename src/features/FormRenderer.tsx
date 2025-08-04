import TextInput from "../components/common/TextInput";
import DateInput from "../components/common/DateInput";
import AutoSuggestInput from "../components/common/AutoSuggestInput";
import UploadField from "../components/common/UploadField";
import PrimaryButton from "../components/common/PrimaryButton";
import EditableTable from "../components/common/EditableTable";
import EmployeeCard from "@/components/EmployeeCard";

export default function FormRenderer({ schema }: { schema: unknown }) {
  const employeeFields = [
    {
      type: "autoSuggest",
      label: "Emp No",
      name: "empNo",
      suggestions: ["E101", "E102", "E103"],
    },
    { type: "text", label: "Emp Name", name: "empName" },
    {
      type: "dropdown",
      label: "Designation",
      name: "designation",
      options: ["Developer", "Manager"],
    },
    { type: "text", label: "Created By", name: "createdBy" },
  ];

  return (
    <div className="space-y-6">
      {schema.fields.map((field: any) => {
        switch (field.type) {
          case "text":
            return <TextInput key={field.name} {...field} />;
          case "date":
            return <DateInput key={field.name} {...field} />;
          case "autoSuggest":
            return <AutoSuggestInput key={field.name} {...field} />;
          case "upload":
            return <UploadField key={field.label} {...field} />;
          default:
            return null;
        }
      })}

      <div className="border p-4 rounded">
        <p className="text-sm font-medium text-gray-700 mb-2">
          {schema.searchSection.label}
        </p>
        {/* Your search logic here */}
      </div>

      <div className="flex gap-2">
        {schema.actions.map((btn: any, i: number) => (
          <PrimaryButton key={i} {...btn} />
        ))}
      </div>

      <div>
        <EmployeeCard
          fields={employeeFields.filter((f) =>
            ["empNo", "empName"].includes(f.name)
          )}
        />
      </div>

      <EditableTable columns={schema.table.columns} />
    </div>
  );
}
