// components/FormCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Pencil, X, Check } from "lucide-react";
import { useState } from "react";

interface FormField {
  id: string;
  label: string;
  type?: "text" | "email" | "date" | "textarea" | "password" | "number";
  placeholder?: string;
  value?: string;
  icon?: React.ReactNode;
  rows?: number;
  gridSpan?: number;
}

interface FormCardProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit?: (data: Record<string, string>) => void;
  submitText?: string;
  avatar?: string;
  grid?: number;
}

export const FormCard = ({
  title,
  description,
  fields,
  onSubmit,
  submitText = "Save Changes",
  avatar,
  grid = 1,
}: FormCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => {
      acc[field.id] = field.value || "";
      return acc;
    }, {} as Record<string, string>)
  );

  // Calculate empty grid slots for button placement
  const calculateEmptySlots = () => {
    if (grid === 1) return 0; // No empty slots in single column
    const totalFields = fields.length;
    const remainder = totalFields % grid;
    return remainder === 0 ? 0 : grid - remainder;
  };

  const emptySlots = calculateEmptySlots();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;
    onSubmit(data);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDisplayValue = (value: string, type?: string) => {
    if (!value) return "-";
    if (type === "date") {
      return new Date(value).toLocaleDateString();
    }
    return value;
  };

  const getGridClasses = () => {
    switch (grid) {
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="w-full rounded-xl shadow-lg sm:shadow-2xl shadow-gray-600/30 dark:shadow-md dark:shadow-gray-50/20 border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Header with reduced padding */}
        <div className="relative">
          <div className="absolute left-3 sm:left-4 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>

          <CardHeader className="pb-0 pl-6 sm:pl-6 pr-2 pt-2">
            {" "}
            {/* Reduced padding */}
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base sm:text-md font-bold">
                  {" "}
                  {/* Smaller font */}
                  {title}
                </CardTitle>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0">
                    {" "}
                    {/* Reduced margin */}
                    {description}
                  </p>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                  {/* Smaller icon */}
                </button>
              )}
            </div>
          </CardHeader>
        </div>

        {avatar && (
          <div className="flex justify-center mt-1 mb-2">
            {" "}
            {/* Reduced margin */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full">
              {" "}
              {/* Smaller avatar */}
              <img
                src={avatar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={`grid ${getGridClasses()} gap-2 px-3 sm:px-4 pb-1`}>
            {" "}
            {/* Reduced padding and gap */}
            {fields.map((field) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`${
                  field.gridSpan ? `md:col-span-${field.gridSpan}` : ""
                }`}
              >
                <CardContent className="space-y-0 p-0">
                  {" "}
                  {/* Removed vertical space */}
                  <div className="grid grid-cols-12 items-center gap-1">
                    {" "}
                    {/* Tightened gap */}
                    <div className="col-span-4 flex items-center gap-1">
                      {" "}
                      {/* Tightened gap */}
                      {field.icon && (
                        <div className="text-gray-500 dark:text-gray-400">
                          {field.icon}
                        </div>
                      )}
                      <Label
                        htmlFor={field.id}
                        className="text-xs font-medium whitespace-nowrap"
                      >
                        {field.label}
                      </Label>
                    </div>
                    <div className="col-span-8">
                      {isEditing ? (
                        field.type === "textarea" ? (
                          <Textarea
                            id={field.id}
                            name={field.id}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ""}
                            onChange={handleChange}
                            className="w-full text-xs transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 py-1" /* Reduced padding */
                            rows={field.rows || 2} /* Smaller default rows */
                          />
                        ) : (
                          <Input
                            id={field.id}
                            name={field.id}
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ""}
                            onChange={handleChange}
                            className="w-full text-xs transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 py-1 h-7" /* Fixed height */
                          />
                        )
                      ) : (
                        <div
                          className={`text-xs text-gray-700 dark:text-gray-300 px-1 py-0.5 ${
                            field.type === "textarea"
                              ? "whitespace-pre-line"
                              : ""
                          }`}
                        >
                          {formatDisplayValue(formData[field.id], field.type)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            ))}
            {/* Buttons in empty slots */}
            {isEditing && emptySlots > 0 && (
              <div
                className={`md:col-span-${emptySlots} flex items-end justify-end pt-1`}
              >
                {" "}
                {/* Reduced padding */}
                <div className="flex gap-1 w-full justify-end">
                  {" "}
                  {/* Tightened gap */}
                  <Button
                    type="button"
                    variant="outline"
                    className="px-2 text-xs h-6" /* Compact button */
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-2 text-xs h-6" /* Compact button */
                  >
                    <Check className="mr-1 h-3 w-3" />
                    {submitText}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Fallback button placement */}
          {isEditing && emptySlots === 0 && (
            <CardFooter className="flex flex-row justify-end gap-1 px-3 pb-2 pt-1 w-full">
              {" "}
              {/* Reduced padding */}
              <div className="flex-1" />
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  className="px-2 text-xs h-6"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Cancel
                </Button>
                <Button type="submit" className="px-2 text-xs h-6">
                  <Check className="mr-1 h-3 w-3" />
                  {submitText}
                </Button>
              </div>
            </CardFooter>
          )}
        </form>
      </Card>
    </motion.div>
  );
};
