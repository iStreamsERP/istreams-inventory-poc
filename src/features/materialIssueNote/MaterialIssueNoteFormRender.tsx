import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import TextInput from "../../components/common/TextInput";
import DateInput from "../../components/common/DateInput";
import AutoSuggestInput from "../../components/common/AutoSuggestInput";
import UploadField from "../../components/common/UploadField";
import PrimaryButton from "../../components/common/PrimaryButton";
import EmployeeCard from "@/components/EmployeeCard";
import type {
  FormSchema,
  FieldConfig,
} from "@/features/materialIssueNote/materialIssueNoteSchema";

interface MaterialIssueNoteFormRenderProps {
  schema: FormSchema;
}

export default function MaterialIssueNoteFormRender({
  schema,
}: MaterialIssueNoteFormRenderProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: Object.fromEntries(
      Object.values(schema.sections)
        .flatMap((section) => section.fields)
        .map((field) => [
          field.name,
          field.defaultValue || (field.type === "checkbox" ? false : ""),
        ])
    ),
  });

  const [suggestionsMap, setSuggestionsMap] = useState<
    Record<string, { id: string; name: string }[] | string[]>
  >({});

  // Fetch dynamic suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      const newSuggestions: Record<
        string,
        { id: string; name: string }[] | string[]
      > = {};
      for (const section of Object.values(schema.sections)) {
        for (const field of section.fields) {
          if (
            field.type === "autoSuggest" &&
            typeof field.suggestions === "function"
          ) {
            const suggestions = await field.suggestions();
            newSuggestions[field.name] = suggestions;
          } else if (
            field.type === "autoSuggest" &&
            Array.isArray(field.suggestions)
          ) {
            newSuggestions[field.name] = field.suggestions;
          }
        }
      }
      setSuggestionsMap(newSuggestions);
    };
    loadSuggestions();
  }, [schema]);

  const onSubmit = async (data: any) => {
    try {
      const apiData = Object.fromEntries(
        Object.values(schema.sections)
          .flatMap((section) => section.fields)
          .map((field) => [field.dbField, data[field.name]])
      );
      console.log("API Payload:", apiData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit form.");
    }
  };

  const renderField = (field: FieldConfig, sectionKey: string) => {
    const commonProps = {
      key: field.name,
      name: field.name,
      label: field.label,
      required: field.required,
      error: errors[field.name]?.message as string | undefined,
    };

    // Conditionally render fields based on showAfterSelection
    const selectedValue = watch(field.name);
    if (field.displayConfig?.showAfterSelection && !selectedValue) {
      return null;
    }

    return (
      <Controller
        name={field.name}
        control={control}
        rules={{
          required: field.required ? `${field.label} is required` : false,
          maxLength: field.validationRules?.maxLength
            ? {
                value: field.validationRules.maxLength,
                message: field.validationRules.errorMessage,
              }
            : undefined,
          minLength: field.validationRules?.minLength
            ? {
                value: field.validationRules.minLength,
                message: field.validationRules.errorMessage,
              }
            : undefined,
          pattern: field.validationRules?.regex
            ? {
                value: field.validationRules.regex,
                message: field.validationRules.errorMessage,
              }
            : undefined,
        }}
        render={({ field: formField }) => {
          const handleAutoSuggestChange = (value: string) => {
            formField.onChange(value);
            if (field.linkedField && field.type === "autoSuggest") {
              const selected = (
                suggestionsMap[field.name] as { id: string; name: string }[]
              )?.find((s) => s.id === value);
              if (selected && field.linkedField) {
                setValue(
                  field.linkedField.name,
                  selected[field.linkedField.displayKey]
                );
              }
            }
          };

          const className =
            field.displayConfig?.layout === "fullWidth"
              ? "col-span-2"
              : field.displayConfig?.layout === "sideBySide"
              ? "col-span-1"
              : "col-span-1";

          switch (field.type) {
            case "text":
              return (
                <div className={className}>
                  <TextInput
                    {...commonProps}
                    {...formField}
                    placeholder={field.placeholder}
                  />
                </div>
              );
            case "date":
              return (
                <div className={className}>
                  <DateInput {...commonProps} {...formField} />
                </div>
              );
            case "autoSuggest":
              return (
                <div className={className}>
                  <AutoSuggestInput
                    {...commonProps}
                    {...formField}
                    onChange={handleAutoSuggestChange}
                    suggestions={suggestionsMap[field.name] || []}
                  />
                </div>
              );
            case "dropdown":
              return (
                <div className={className}>
                  <select
                    {...commonProps}
                    {...formField}
                    className={`border p-2 rounded w-full ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            case "upload":
              return (
                <div className={className}>
                  <UploadField {...commonProps} {...formField} />
                </div>
              );
            case "checkbox":
              return (
                <div className={className}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={field.name}
                      {...formField}
                      checked={formField.value}
                      className="mr-2"
                    />
                    <label htmlFor={field.name}>{field.label}</label>
                  </div>
                </div>
              );
            default:
              return null;
          }
        }}
      />
    );
  };

  const renderSection = (sectionKey: string, section: SectionConfig) => {
    if (section.renderAs === "employeeCard") {
      return (
        <EmployeeCard
          key={sectionKey}
          fields={section.fields}
          errors={Object.fromEntries(
            section.fields.map((field) => [
              field.name,
              errors[field.name]?.message,
            ])
          )}
        />
      );
    }
    return (
      <div key={sectionKey} className="border rounded-md p-4">
        <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map((field) => renderField(field, sectionKey))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(schema.sections).map(([sectionKey, section]) =>
          renderSection(sectionKey, section)
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </PrimaryButton>
        <PrimaryButton
          type="button"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Reset
        </PrimaryButton>
      </div>
    </form>
  );
}
