import { createAsyncAction } from '../helpers/redux';
import Fetch from '../helpers/fetch';
import $ from '../types/sections';

import axiosClient from '../../api/axiosClient'

export const addNode = (path, index, payload) =>
({
  type: $.ADD_SECTION_NODE,
  payload: {
    path,
    index,
    payload,
  },
});

export const removeNode = (path, index) => ({
  type: $.REMOVE_SECTION_NODE,
  payload: {
    path,
    index,
  },
});

export const moveNode = (path, indexFrom, indexTo) => ({
  type: $.MOVE_SECTION_NODE,
  payload: {
    path,
    index: indexFrom,
    payload: { indexTo },
  },
});


export const editProperties = (path, data) => (
  {
  type: $.EDIT_PROPERTIES,
  payload: { path, data },
});

export const fetchSections = (appid, formId) =>
  createAsyncAction(
    Fetch.get({
      path: `getsections/${appid}/${formId}`,
    }),
    $.FETCH_SECTION_REQUEST,

  );

  export const saveSections = (appid, formId, data) =>
  createAsyncAction(
    Fetch.put({
      path: `updatesections/${appid}/${formId}`, 
      body: data,
    }),
    $.SAVE_SECTION_REQUEST,

  );

