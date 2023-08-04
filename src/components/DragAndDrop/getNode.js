import React from 'react';

function getNode(payload) {
  let o = {};
  //o._id = payload.fieldsymbol;
  o._id = payload.id;
  o.label = payload.label;
  o.backgroundcolor = payload.backgroundcolor;
  let retainVal = payload.retainvalue;
  switch (payload.type) {
    case 1:
      o.fontsize = payload.fontsize;
      o.italic = payload.italic;
      o.textalign = payload.textalign;
      o.width = payload.width;
      o.height = payload.height;
      o.font = payload.font;
      o.texttype = payload.texttype;
      o.multiline = payload.multiline;
      o.required = payload.required;
      o.validation = payload.validation;
      o.datafield = payload.datafield;
      o.maximumlength = payload.maximumlength;
      o.errormessage = payload.errormessage;
      break;
    // URL
    case 3:
      o.fontsize = payload.fontsize;
      o.italic = payload.italic;
      o.textalign = payload.textalign;
      o.width = payload.width;
      o.height = payload.height;
      o.font = payload.font;
      o.redirectto = payload.redirectto;
      o.valuefield = payload.valuefield;
      break;
    // Date Time
    case 20:
      o.fontsize = payload.fontsize;
      o.italic = payload.italic;
      o.textalign = payload.textalign;
      o.width = payload.width;
      o.height = payload.height;
      o.font = payload.font;
      o.required = payload.required;
      o.validation = payload.validation;
      break;


    case 60:
      // button
      o.fontsize = payload.fontsize;
      o.italic = payload.italic;
      o.textalign = payload.textalign;
      o.width = payload.width;
      o.height = payload.height;
      o.font = payload.font;
      o.texttype = payload.texttype;
      o.required = payload.required;
      o.validation = payload.validation;
      break;

    case 30:
      // boolean
      o.required = payload.required;
      o.validation = payload.validation;
      o.valuefield = payload.valuefield;
      o.checked = payload.checked;
      o.checkype = payload.checktype ? payload.checktype : '1';
      o.datafield = payload.datafield;
      break;

    case 50:
      // Grid
      o.gridcols = payload.gridcols;
      o.parentcol = payload.parentcol;
      o.customcols = payload.customcols;
      o.hasdelete = payload.hasdelete;
      o.hasnew = payload.hasnew;
      o.height = payload.height;
      o.italic = payload.italic;
      o.layout = payload.layout;
      o.perpage = payload.perpage;
      o.tableref = payload.tableref;
      o.dataref= payload.dataref;
      o.datarefid = payload.datarefid;
      o.editable = payload.editable;
      o.modifieduser = payload.modifieduser ? payload.modifieduser : false;
      o.modifiedteam = payload.modifiedteam ? payload.modifiedteam : false;
      o.modifieddate = payload.modifieddate ? payload.modifieddate : false;
      o.font = payload.font;
      o.grid = "Grid+++++";
      break;
    case 330:
      // boolean
      o.required = payload.required;
      o.defaultvalue = payload.defaultvalue;
      o.valuefield = payload.valuefield;
      // o.checked = payload.checked;
      o.checkype = payload.checktype ? payload.checktype : '1';
      // o.dataref = payload.value;
      break;
    case 320:
      // date : TODO
      o.defaultvalue = payload.defaultvalue;
      o.datafield = payload.datafield;
      o.required = payload.required;
      o.validation = payload.validation;
      o.valuefield = payload.valuefield;
      o.width = payload.width;
      o.checked = payload.checked;
      o.checkype = payload.checktype ? payload.checktype : '1';
      break;
    case 301:
      o.defaultvalue = payload.defaultvalue;
      o.fontsize = payload.fontsize;
      o.italic = payload.italic;
      o.textalign = payload.textalign;
      o.width = payload.width;
      o.height = payload.height;
      o.font = payload.font;
      o.texttype = payload.texttype;
      o.multiline = payload.multiline;
      o.required = payload.required;
      o.validation = payload.validation;
      o.datafield = payload.datafield;
      o.maximumlength = payload.maximumlength;
      break;
    case 302:
      // Number
      o.defaultvalue = payload.defaultvalue;
      o.fontsize = payload.fontsize;
      o.italic = payload.italic;
      o.textalign = payload.textalign;
      o.width = payload.width;
      o.height = payload.height;
      o.font = payload.font;
      o.required = payload.required;
      o.validation = payload.validation;
      o.datafield = payload.datafield;
      o.maximumlength = payload.maximumlength;
      o.numberformat = payload.numberformat;
      o.graphical = payload.graphical;
      o.fieldsymbol = payload.fieldsymbol;
      break;
    case 303:
      // Number
      o.defaultvalue = payload.defaultvalue;
      o.fontsize = payload.fontsize;
      o.italic = payload.italic;
      o.textalign = payload.textalign;
      o.width = payload.width;
      o.height = payload.height;
      o.font = payload.font;
      o.required = payload.required;
      o.validation = payload.validation;
      o.datafield = payload.datafield;
      o.maximumlength = payload.maximumlength;
      o.numberformat = payload.numberformat;
      o.fieldsymbol = payload.fieldsymbol;
      break;
    case 40:
    case 41:
    case 340:
      // Lookup
      o.defaultvalue = payload.defaultvalue;
      o.datafield = payload.datafield;
      o.required = payload.required;
      o.valuefield = payload.valuefield;
      o.datafield = payload.datafield;
      o.width = payload.width;
      o.multiline = payload.multiline;
      if (retainVal) {
        o.retainvalue = payload.retainvalue
      }
      else {
        o.retainvalue = false;
      }
      if (payload.fieldcondition) {
        o.fieldcondition = payload.fieldcondition;
      }
      else {
        o.fieldcondition = [];
      }
      break;
    case 341:
      // Lookup
      //console.log('---341-----------', payload)
      o.defaultvalue = payload.defaultvalue;
      o.dataref = payload.dataref;
      o.datafield = payload.dataref;
      o.required = payload.required;
      o.valuefield = payload.valuefield;
      if (retainVal) {
        o.retainvalue = payload.retainvalue
      }
      else {
        o.retainvalue = false;
      }
      o.width = payload.width;
      o.fieldtoshow = "";
      o.datarefid = payload.datarefid;
      o.link = "";
      o.linkmode = 0;
      if (payload.fieldcondition) {
        o.fieldcondition = payload.fieldcondition;
      }
      else {
        o.fieldcondition = [];
      }
      break;
    case 342:
      // Lookup Reference
      //console.log('---341-----------', payload)
      o.defaultvalue = payload.defaultvalue;
      o.dataref = payload.dataref;
      o.datarefid = payload.datarefid;
      o.required = payload.required;
      o.valuefield = payload.valuefield;
      o.width = payload.width;
      o.datarefid = payload.datarefid;
      o.relatedrefcolumn = payload.relatedrefcolumn;
      o.relatedreftable = payload.relatedreftable;
      break;
    default:
      o = payload;

  }

  if (payload.shapevalue) { o.shapevalue = payload.shapevalue }
  else { o.shapevalue = payload.label }
  o.type = payload.type;
  o.name = payload.name;
  //console.log(payload, '//--.......get node ..............', o)
  return o;
}

export default getNode;
