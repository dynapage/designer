// Generic Controls
// 1-19 (String / Number)
// 20-29 (date)
// 30-39 (Boolean)
// 40-59 (List , drop down, menu, Grid, tab)
// 60-69 (buttons)
// 70-89 (image, image gallery, Maps)

// Database controls:
// 301: Text
// 302: Number
// 320: Date
// 330: Boolean
// 370: Picture
// 380: Object / File
// 307: GUID
// 340: Lookup List
// 341: Lookup table

export const rows = [
  {
    label: 'One column section',
    name: '1_column_sec',
    type: 9991,
    generatorOptions: {
      columnCount: 1,
      deleteProperties: ['label'],
    },
  },
  {
    label: 'Two columns section',
    type: 9992,
    generatorOptions: {
      columnCount: 2,
      deleteProperties: ['label'],
    },
  },
  {
    label: 'Three columns section',
    type: 9993,
    generatorOptions: {
      columnCount: 3,
      deleteProperties: ['label'],
    },
  },
  {
    label: 'Four columns section',
    type: 9994,
    generatorOptions: {
      columnCount: 4,
      deleteProperties: ['label'],
    },
  },
];

export const cards = [
  
  {
    type: 50,
    shapevalue: '',
    label: 'Data Grid',
    editable: true,
    hasnew: false,
    hasdelete: true,
    perpage: 0,
    layout: 0,
    hastickbox: false,
    fontBold: false,
    italic: false,
    fontsize: 12,
    textalign: 'left',
    width: 0,
    height: 0,
    font: '',
    tableref: '',
    datarefid: '',
    grid: 'Grid+++++',
    gridcols: [],
  }
 ,
  {

    type: 2,
    label: 'Label',
    shapevalue: '',
    fontbold: false,
    italic: false,
    fontsize: 12,
    textalign: 'left',
    width: 0,
    tabindex: 0,
    height: 0,
    font: '',
  },
  {
    type: 40,
    label: 'Dropdown list',
    shapevalue: '',
    dataref: '',
    valuefield: '',
    dataorderid: '',
    datafield: [],
    fieldcondition: [],

  }

];

export const controlproperties = [
  {
    "name": "color",
    "inputType": "color",
    "title": "Colour"
  },

  {
    "name": "backgroundcolor",
    "inputType": "color",
    "title": "Background Colour"
  },
  {
    "name": "fontcolor",
    "inputType": "color",
    "title": "Font Colour"
  },
  {
    "name": "disabled",
    "inputType": "checkbox",
    "title": "Disabled?"
  },
  {
    "name": "multiline",
    "inputType": "checkbox",
    "title": "Multilines"
  },
  {
    "name": "required",
    "inputType": "checkbox",
    "title": "Required"
  },
  {
    "name": "validation",
    "inputType": "checkbox",
    "title": "Validation"
  },
  {
    "name": "readonly",
    "inputType": "checkbox",
    "title": "Read only?"
  },
  {
    "name": "modifieduser",
    "inputType": "checkbox",
    "title": "Show modified by (user) column"
  },
  {
    "name": "modifiedteam",
    "inputType": "checkbox",
    "title": "Show modified by (team) column"
  },
  {
    "name": "modifieddate",
    "inputType": "checkbox",
    "title": "Show modified date column"
  },
  {
    "name": "hidden",
    "inputType": "checkbox",
    "title": "Hidden"
  },
  {
    "name": "retainvalue",
    "inputType": "checkbox",
    "title": "Retain Value (on add new)?"
  },
  {
    "name": "texttype",
    "inputType": "texttype",
    "title": "Text Type",
    "options": [{id: 1, value: 'Plain Text'} , {id: 2, value: 'Text Area'} , {id: 3, value: 'Email'} , {id: 4, value: 'Password'}]
  },
  {
    "name": "datafield",
    "inputType": "columnselect",
    "title": "Data Field",
    "options": []
  },
  {
    "name": "datarefid",
    "inputType": "datarefid",
    "title": "Data Field",
    "options": []
  },
  {
    "name": "dataref",
    "inputType": "datarefobject",
    "title": "Reference"
  },
  {
    "name": "checked",
    "inputType": "checked",
    "title": "Boolean (Yes / No)"
  },
  {
    "name": "fieldcondition",
    "inputType": "fieldcondition",
    "title": "Field Condition",
    "options": []
  },
  {
    "name": "errormessage",
    "inputType": "text",
    "title": "Validation Message"
  },
  {
    "name": "label",
    "inputType": "text",
    "title": "Label"
  },
  {
    "name": "textarea",
    "inputType": "rows",
    "title": "Text Area"
  },
  {
    "name": "formulaActive",
    "inputType": "checkbox",
    "title": "Colour"
  },
  {
    "name": "controlDataRef",
    "inputType": "GUID",
    "title": "Colour"
  },
  {
    "name": "CBOcolumnID",
    "inputType": "GUID",
    "title": "Colour"
  },
  {
    "name": "grid",
    "inputType": "grid",
    "title": ""
  },
  {
    "name": "CBOcolumnValue",
    "inputType": "GUID",
    "title": "Colour"
  },
  {
    "name": "GridColumns",
    "inputType": "Array",
    "title": "Colour"
  },
  // {
  //   "name": "hasnew",
  //   "inputType": "checkbox",
  //   "title": "Can Add New"
  // },
  {
    "name": "hasdelete",
    "inputType": "checkbox",
    "title": "Can Delete"
  },
  {
    "name": "editable",
    "inputType": "checkbox",
    "title": "Can Edit"
  },

  {
    "name": "perpage",
    "inputType": "Number",
    "title": "Results per page"
  },
  {
    "name": "layout",
    "inputType": "Number",
    "title": "Layout Type"
  },
  {
    "name": "valuefield",
    "inputType": "valuefield",
    "title": "Value"
  },
]
