
import axiosClient from './axiosClient'
const columnApi = {
    getAll: (applicationId, tableId) => axiosClient.get(`columns/${applicationId}/${tableId}`),
    getGrids: (id) => axiosClient.get(`grids/${id}`),
    getTableByColumnId: (applicationId, datarefId) => axiosClient.get(`tabledetailsbycolumn/${applicationId}/${datarefId}`),
    update: (applicationId, tableId, columnId, body) => axiosClient.put(`column/${applicationId}/${tableId}/${columnId}`, body),
    checkColumnName: (applicationId, columnName) => axiosClient.get(`checkcolumn/${applicationId}/${columnName}`),
    create: (applicationId, tableId, dbName, tabeName, body) => axiosClient.post(`column/${applicationId}/${tableId}/${dbName}/${tabeName}`, body),
    delete: (applicationId, tableId, columnId) => axiosClient.delete(`column/${applicationId}/${tableId}/${columnId}`)
}

export default columnApi