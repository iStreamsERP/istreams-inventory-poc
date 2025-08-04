import { Input } from "@/components/ui";
import { Label } from "@/components/ui";

export default function DateInput({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    <div>
      <Label className="block text-xs font-medium">{label}</Label>
      <Input type="date" name={name} />
    </div>
  );
}
