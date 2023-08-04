import axiosClient from './axiosClient'

const sectionApi = {
 
  update: (applicationId, formId, body) => axiosClient.put(`updatesections/${applicationId}/${formId}`, body),
  getAll: (applicationId, formId) => axiosClient.get(`getsections/${applicationId}/${formId}`),
}

export default sectionApi