import MaterialIssueNoteFormRender from "@/features/materialIssueNote/MaterialIssueNoteFormRender";
import { materialIssueNoteSchema } from "@/features/materialIssueNote/materialIssueNoteSchema";

export const MaterialIssueNote = () => {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="text-2xl font-bold mb-4">{materialIssueNoteSchema.title}</h1>
      <MaterialIssueNoteFormRender schema={materialIssueNoteSchema} />
    </div>
  );
};