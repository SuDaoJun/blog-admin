/** 
 * api接口的统一封装
 */
import axiosObj from '@/api/axios';
let axios = axiosObj.axios;

const statistics = {
  countTotal (params) {
    return axios.get('/statistics/countTotal',{params})
  },
  accessUserStatistics(params) {
    return axios.get('/statistics/accessUserStatistics',{params})
  },
  userStatistics(params) {
    return axios.get('/statistics/userStatistics',{params})
  },
  articleStatistics(params) {
    return axios.get('/statistics/articleStatistics',{params})
  },
  messageStatistics(params) {
    return axios.get('/statistics/messageStatistics',{params})
  },
  accessUserList(params) {
    return axios.get('/statistics/accessUserList',{params})
  },
  userList(params) {
    return axios.get('/statistics/userList',{params})
  },
  articleList(params) {
    return axios.get('/statistics/articleList',{params})
  },
  messageList(params) {
    return axios.get('/statistics/messageList',{params})
  },
  tagList(params) {
    return axios.get('/statistics/tagList',{params})
  }
}
//用户管理
const user = {
  sendEmail (params) {
    return axios.post('/user/sendEmail',params)
  },
  login (params) {
    return axios.post('/user/login',params)
  },
  register (params) {
    return axios.post('/user/register',params)
  },
  resetPwd (params) {
    return axios.post('/user/resetPwd',params)
  },
  setPwd (params) {
    return axios.post('/user/setPwd',params)
  },
  modifyPwd (params) {
    return axios.post('/user/modifyPwd',params)
  },
  userList (params) {
      return axios.get('/user/list',{params})
  },
  userAdd (params) {
      return axios.post('/user/add',params)
  },
  userUpdate (params) {
      return axios.put('/user/update',params)
  },
  userDel(id){
      return axios.delete('/user/del/'+id)
  },
  statementList(params){
    return axios.get('/statement/list',{params})
  },
  statementUpdate(params){
    return axios.put('/statement/update',params,{
    headers : {
      "Content-Type": "application/json;charset=UTF-8"
    }})
  }
}

const article = {
  articleList (params) {
      return axios.get('/article/list',{params})
  },
  articleDetail (params) {
      return axios.get('/article/detail',{params})
  },
  articleAdd (params) {
      return axios.post('/article/add',params)
  },
  articleUpdate (params) {
      return axios.put('/article/update',params)
  },
  articleDel(id){
      return axios.delete('/article/del/'+id)
  },

  tagList (params) {
      return axios.get('/tag/list',{params})
  },
  tagAdd (params) {
      return axios.post('/tag/add',params)
  },
  tagUpdate (params) {
      return axios.put('/tag/update',params)
  },
  tagDel(id){
      return axios.delete('/tag/del/'+id)
  },

  commentList (params) {
      return axios.get('/comment/list',{params})
  },
  commentAdd (params) {
      return axios.post('/comment/add',params)
  },
  commentUpdate (params) {
      return axios.put('/comment/update',params)
  },
  commentTop(params){
    return axios.put('/comment/sticky',params)
  },
  commentDel(id){
      return axios.delete('/comment/del/'+id)
  },
  replyCommentAdd (params) {
      return axios.post('/replyComment/add',params)
  },
  replyCommentUpdate (params) {
      return axios.put('/replyComment/update',params)
  },
  replyCommentDel(id){
      return axios.delete('/replyComment/del/'+id)
  },
  articleImgStatistics (params) {
      return axios.get('/statistics/articleImgStatistics',{params})
  },
}
const project = {
  projectList (params) {
      return axios.get('/project/list',{params})
  },
  projectAdd (params) {
      return axios.post('/project/add',params)
  },
  projectUpdate (params) {
      return axios.put('/project/update',params)
  },
  projectDel(id){
      return axios.delete('/project/del/'+id)
  }
}
const link = {
  linkList (params) {
      return axios.get('/link/list',{params})
  },
  linkAdd (params) {
      return axios.post('/link/add',params)
  },
  linkUpdate (params) {
      return axios.put('/link/update',params)
  },
  linkDel(id){
      return axios.delete('/link/del/'+id)
  }
}
const message = {
  messageList (params) {
      return axios.get('/message/list',{params})
  },
  messageAdd (params) {
      return axios.post('/message/add',params)
  },
  messageUpdate (params) {
      return axios.put('/message/update',params)
  },
  messageDel(id){
      return axios.delete('/message/del/'+id)
  }
}
const menu = {
  menuTree (params) {
      return axios.get('/menu/tree',{params})
  },
  menuAdd (params) {
      return axios.post('/menu/add',params)
  },
  menuUpdate (params) {
      return axios.put('/menu/update',params)
  },
  menuDel(id){
      return axios.delete('/menu/del/'+id)
  },
  functionAdd (params) {
      return axios.post('/functionOper/add',params)
  },
  functionUpdate (params) {
      return axios.put('/functionOper/update',params)
  },
  functionDel(id){
      return axios.delete('/functionOper/del/'+id)
  }
}
const role = {
  roleList (params) {
      return axios.get('/role/list',{params})
  },
  roleUserList (params) {
      return axios.get('/role/userList',{params})
  },
  roleAdd (params) {
      return axios.post('/role/add',params)
  },
  roleUpdate (params) {
      return axios.put('/role/update',params)
  },
  setRoleAuth (params) {
      return axios.put('/role/setAuth',params)
  },
  updateMuchUser (params) {
      return axios.put('/role/updateMuchUser',params)
  },
  roleDel(id){
      return axios.delete('/role/del/'+id)
  },
}
const upload = {
  uploadFile (param,callback){
    return axios.post('/file/upload',param,{
      headers : {
          "Content-Type": "multipart/form-data;charset=UTF-8"
      },
    onUploadProgress: progressEvent => {
        callback(progressEvent);
      }
    })
  },
  fileDel(id){
     return axios.delete('/file/del/'+id)
  }
}
export default {
  statistics,
  user,
  article,
  project,
  link,
  message,
  menu,
  role,
  upload
}