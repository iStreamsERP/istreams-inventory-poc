import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

export default function Dropdown({
  key,
  label,
  name,
  placeholder = "Select",
  options,
  value,
  onChange,
}: {
  key: string;
  label: string;
  name: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div key={key}>
      <Label className="block text-xs font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]" id={name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option, i) => (
              <SelectItem key={i} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
