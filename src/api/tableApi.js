import axiosClient from './axiosClient'

const tableApi = {
    getLookupColumns: (applicationId, tableId) => axiosClient.get(`columns/${applicationId}/${tableId}`),
    getAll: (applicationId) => axiosClient.get(`apptables/${applicationId}`),
    create: (applicationId, dbName, body) => axiosClient.post(`apptables/${applicationId}/${dbName}`, body),
    delete: (applicationId, columnid, dbName, tableName) => axiosClient.delete(`apptables/${applicationId}/${columnid}/${dbName}/${tableName}`)
}

export default tableApi