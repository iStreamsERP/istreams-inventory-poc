import FormRenderer from "@/features/FormRenderer";
import { projectFormSchema } from "../config/projectFormSchema";

export const MaterialRequisition = ()  => {
  return (
    <div className="mx-auto">
      <h1 className="text-xl font-bold mb-6">{projectFormSchema.title}</h1>
      <FormRenderer schema={projectFormSchema} />
    </div>
  );
}
