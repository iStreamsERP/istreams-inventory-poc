export const materialMasterSchema = {
  title: "Project Entry Form",
  fields: [
    {
      type: "date",
      label: "Date",
      name: "date",
      dbField: "PROJECT_NO",
    },
    {
      type: "text",
      label: "Requsition No",
      name: "refSerialNo",
      dbField: "PROJECT_NO",
    },
    {
      type: "text",
      label: "MR No",
      name: "refSerialNo",
      dbField: "PROJECT_NO",
    },
    {
      type: "text",
      label: "MR Ref No",
      name: "refSerialNo",
      dbField: "PROJECT_NO",
    },
  ],
  searchSection: {
    type: "projectSearch",
    label: "Search Project",
  },
  actions: [
    { type: "primary", label: "Add Material" },
    { type: "secondary", label: "New Material" },
    { type: "text", label: "Raise PR" },
  ],
  table: {
    editable: true,
    columns: [
      { type: "text", label: "Material Name", field: "material" },
      { type: "date", label: "Required Date", field: "requiredDate" },
      { type: "checkbox", label: "Urgent?", field: "urgent" },
    ],
  },
};
