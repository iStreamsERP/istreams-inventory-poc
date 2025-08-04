import { Button } from "@/components/ui";

interface PrimaryButtonProps {
  type: "submit" | "button";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({
  type,
  children,
  onClick,
  disabled,
}: PrimaryButtonProps) {
  return (
    <Button
      size={"sm"}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={` disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {children}
    </Button>
  );
}
