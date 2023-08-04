import axiosClient from './axiosClient'

const formApi = {
    getFormsByTableId: (applicationId, tableId) => axiosClient.get(`appformsbytableid/${applicationId}/${tableId}`),
    create: (applicationId, tableId, body) => axiosClient.post(`appforms/${applicationId}/${tableId}`, body),
    update: (applicationId, formId, body) => axiosClient.put(`appforms/${applicationId}/${formId}`, body),
    delete: (applicationId, formId) => axiosClient.delete(`appforms/${applicationId}/${formId}`)
}

export default formApi