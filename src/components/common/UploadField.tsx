import { Input, Label } from "@/components/ui";

export default function UploadField({
  fields,
}: {
  fields: { name: string; label: string; type: string }[];
}) {
  return (
    <div className="border p-4 rounded-md">
      <Label className="block text-xs font-medium">Upload Document</Label>
      <Input type="file" />
      {fields.map((field) => (
        <div key={field.name} className="mb-2">
          <label className="block text-sm mb-1">{field.label}</label>
          <Input
            type="text"
          />
        </div>
      ))}
    </div>
  );
}
