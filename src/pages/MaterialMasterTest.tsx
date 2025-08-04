import MaterialMasterFormRenderer from "@/features/MaterialMasterFormRenderer";
import { materialMasterSchema } from "@/config/materialMasterSchema";

export const MaterialMasterTest = ()  => {
  return (
    <div className="mx-auto">
      <h1 className="text-xl font-bold mb-6">{materialMasterSchema.title}</h1>
      <MaterialMasterFormRenderer schema={materialMasterSchema} />
    </div>
  );
}
