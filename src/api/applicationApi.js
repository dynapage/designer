import axiosClient from './axiosClient'

const applicationApi = {
  create: (designerid, body) => axiosClient.post(`applications/${designerid}`, body),
  getAll: (designerid) => axiosClient.get(`applications_by_user/${designerid}`),
  updatePositoin: (params) => axiosClient.put('applications', params),
  getOne: (id) => axiosClient.get(`applications/${id}`),
  delete: (id, dbname, userid) => axiosClient.delete(`application/${id}/${dbname}/${userid}`),
  update: (id, body) => axiosClient.put(`application_save_changes/${id}`, body),
  getTeams: (id) => axiosClient.get(`applicationteams/${id}`),
  updateTeams: (id, body) => axiosClient.put(`applicationteams/${id}`, body),
  createUser: (id, teamid, body) => axiosClient.post(`appuser/${id}/${teamid}`, body),
  updateUser: (id, teamid, userid, body) => axiosClient.put(`appuser/${id}/${teamid}/${userid}`, body),
  deleteUser: (id, teamid, userid) => axiosClient.delete(`appuser/${id}/${teamid}/${userid}`),
  //users
  updateFavouritePosition: (params) => axiosClient.put('applications/favourites', params)
}

export default applicationApi