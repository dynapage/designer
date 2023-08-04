import axiosClient from './axiosClient'

const taskApi = {
  create: (applicationId, params) => axiosClient.post(`applications/${applicationId}/tasks`, params),
  updatePosition: (applicationId, params) => axiosClient.put(
    `applications/${applicationId}/tasks/update-position`,
    params
  ),
  delete: (applicationId, taskId) => axiosClient.delete(`applications/${applicationId}/tasks/${taskId}`),
  update: (applicationId, taskId, params) => axiosClient.put(
    `applications/${applicationId}/tasks/${taskId}`,
    params
  )
}

export default taskApi