export const projectFormSchema = {
  title: 'Project Entry Form',
  fields: [
    {
      type: 'text',
      label: 'Ref. Serial No',
      name: 'refSerialNo',
      dbField: 'PROJECT_NO',
    },
    {
      type: 'date',
      label: 'Date',
      name: 'date',
      dbField: 'PROJECT_NO',
    },
    {
      type: 'text',
      label: 'MR Ref #',
      name: 'mrRef',
      dbField: 'PROJECT_NO',
    },
    {
      type: 'text',
      label: 'Project No',
      name: 'projectNo',
      dbField: 'PROJECT_NO',
    },
    {
      type: 'date',
      label: 'Start Date',
      name: 'startDate',
    },
    {
      type: 'autoSuggest',
      label: 'Client Name',
      name: 'clientName',
      suggestions: ['TCS', 'Infosys', 'Wipro'],
    },
    {
      type: 'upload',
      label: 'Upload Document',
      fields: [
        { name: 'docNo', label: 'Document No', type: 'text' },
        { name: 'docName', label: 'Document Name', type: 'text' },
      ],
    },
  ],
  searchSection: {
    type: 'projectSearch',
    label: 'Search Project',
  },
  actions: [
    { type: 'primary', label: 'Add Material' },
    { type: 'secondary', label: 'New Material' },
    { type: 'text', label: 'Raise PR' },
  ],
  table: {
    editable: true,
    columns: [
      { type: 'text', label: 'Material Name', field: 'material' },
      { type: 'date', label: 'Required Date', field: 'requiredDate' },
      { type: 'checkbox', label: 'Urgent?', field: 'urgent' },
    ],
  },
};