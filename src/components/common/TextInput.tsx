import { Input, Label } from "@/components/ui";

interface TextInputProps {
  key: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export default function TextInput({
  key,
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  error,
}: TextInputProps) {
  return (
    <div key={key}>
      <Label className="block text-xs font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`border ${error ? "border-red-500" : ""}`}
        placeholder={placeholder || label}
      />
      <div>{error && <p className="text-red-500 text-xs">{error}</p>}</div>
    </div>
  );
}
