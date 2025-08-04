import TextInput from "../components/common/TextInput";
import DateInput from "../components/common/DateInput";
import AutoSuggestInput from "../components/common/AutoSuggestInput";
import UploadField from "../components/common/UploadField";
import PrimaryButton from "../components/common/PrimaryButton";
import EditableTable from "../components/common/EditableTable";
import EmployeeCard from "@/components/EmployeeCard";

export default function MaterialMasterFormRenderer({
  schema,
}: {
  schema: any;
}) {
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-1 border rounded-md p-2 max-w-md">
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

          <div className="flex gap-2">
            {schema.actions.map((btn: any, i: number) => (
              <PrimaryButton key={i} {...btn} />
            ))}
          </div>
        </div>
        <div>
          <EmployeeCard
            fields={employeeFields.filter((f) =>
              ["empNo", "empName", "designation", "createdBy"].includes(f.name)
            )}
          />
        </div>
      </div>
      <EditableTable columns={schema.table.columns} />
    </div>
  );
}
