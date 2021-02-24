/** 
 * api接口的统一封装
 */
import axiosObj from '@/api/axios';
let axios = axiosObj.axios;

const statistics = {
  countTotal (params:any) {
    return axios.get('/statistics/countTotal',{params})
  },
  accessUserStatistics(params:any) {
    return axios.get('/statistics/accessUserStatistics',{params})
  },
  userStatistics(params:any) {
    return axios.get('/statistics/userStatistics',{params})
  },
  articleStatistics(params:any) {
    return axios.get('/statistics/articleStatistics',{params})
  },
  messageStatistics(params:any) {
    return axios.get('/statistics/messageStatistics',{params})
  },
  accessUserList(params:any) {
    return axios.get('/statistics/accessUserList',{params})
  },
  userList(params:any) {
    return axios.get('/statistics/userList',{params})
  },
  articleList(params:any) {
    return axios.get('/statistics/articleList',{params})
  },
  messageList(params:any) {
    return axios.get('/statistics/messageList',{params})
  },
  tagList(params:any) {
    return axios.get('/statistics/tagList',{params})
  }
}
//用户管理
const user = {
  sendEmail (params:any) {
    return axios.post('/user/sendEmail',params)
  },
  login (params:any) {
    return axios.post('/user/login',params)
  },
  register (params:any) {
    return axios.post('/user/register',params)
  },
  resetPwd (params:any) {
    return axios.post('/user/resetPwd',params)
  },
  setPwd (params:any) {
    return axios.post('/user/setPwd',params)
  },
  modifyPwd (params:any) {
    return axios.post('/user/modifyPwd',params)
  },
  userList (params:any) {
      return axios.get('/user/list',{params})
  },
  userAdd (params:any) {
      return axios.post('/user/add',params)
  },
  userUpdate (params:any) {
      return axios.put('/user/update',params)
  },
  userDel(id:string){
      return axios.delete('/user/del/'+id)
  },
  statementList(params:any){
    return axios.get('/statement/list',{params})
  },
  statementUpdate(params:any){
    return axios.put('/statement/update',params,{
    headers : {
      "Content-Type": "application/json;charset=UTF-8"
    }})
  }
}

const article = {
  articleList (params:any) {
      return axios.get('/article/list',{params})
  },
  articleDetail (params:any) {
      return axios.get('/article/detail',{params})
  },
  articleAdd (params:any) {
      return axios.post('/article/add',params)
  },
  articleUpdate (params:any) {
      return axios.put('/article/update',params)
  },
  articleDel(id:string){
      return axios.delete('/article/del/'+id)
  },

  tagList (params:any) {
      return axios.get('/tag/list',{params})
  },
  tagAdd (params:any) {
      return axios.post('/tag/add',params)
  },
  tagUpdate (params:any) {
      return axios.put('/tag/update',params)
  },
  tagDel(id:string){
      return axios.delete('/tag/del/'+id)
  },

  commentList (params:any) {
      return axios.get('/comment/list',{params})
  },
  commentAdd (params:any) {
      return axios.post('/comment/add',params)
  },
  commentUpdate (params:any) {
      return axios.put('/comment/update',params)
  },
  commentTop(params:any){
    return axios.put('/comment/sticky',params)
  },
  commentDel(id:string){
      return axios.delete('/comment/del/'+id)
  },
  replyCommentAdd (params:any) {
      return axios.post('/replyComment/add',params)
  },
  replyCommentUpdate (params:any) {
      return axios.put('/replyComment/update',params)
  },
  replyCommentDel(id:string){
      return axios.delete('/replyComment/del/'+id)
  },
  articleImgStatistics (params:any) {
      return axios.get('/statistics/articleImgStatistics',{params})
  },
}
const project = {
  projectList (params:any) {
      return axios.get('/project/list',{params})
  },
  projectAdd (params:any) {
      return axios.post('/project/add',params)
  },
  projectUpdate (params:any) {
      return axios.put('/project/update',params)
  },
  projectDel(id:string){
      return axios.delete('/project/del/'+id)
  }
}
const link = {
  linkList (params:any) {
      return axios.get('/link/list',{params})
  },
  linkAdd (params:any) {
      return axios.post('/link/add',params)
  },
  linkUpdate (params:any) {
      return axios.put('/link/update',params)
  },
  linkDel(id:string){
      return axios.delete('/link/del/'+id)
  }
}
const message = {
  messageList (params:any) {
      return axios.get('/message/list',{params})
  },
  messageAdd (params:any) {
      return axios.post('/message/add',params)
  },
  messageUpdate (params:any) {
      return axios.put('/message/update',params)
  },
  messageDel(id:string){
      return axios.delete('/message/del/'+id)
  }
}
const menu = {
  menuTree (params:any) {
      return axios.get('/menu/tree',{params})
  },
  menuAdd (params:any) {
      return axios.post('/menu/add',params)
  },
  menuUpdate (params:any) {
      return axios.put('/menu/update',params)
  },
  menuDel(id:string){
      return axios.delete('/menu/del/'+id)
  },
  functionAdd (params:any) {
      return axios.post('/functionOper/add',params)
  },
  functionUpdate (params:any) {
      return axios.put('/functionOper/update',params)
  },
  functionDel(id:string){
      return axios.delete('/functionOper/del/'+id)
  }
}
const role = {
  roleList (params:any) {
      return axios.get('/role/list',{params})
  },
  roleUserList (params:any) {
      return axios.get('/role/userList',{params})
  },
  roleAdd (params:any) {
      return axios.post('/role/add',params)
  },
  roleUpdate (params:any) {
      return axios.put('/role/update',params)
  },
  setRoleAuth (params:any) {
      return axios.put('/role/setAuth',params)
  },
  updateMuchUser (params:any) {
      return axios.put('/role/updateMuchUser',params)
  },
  roleDel(id:string){
      return axios.delete('/role/del/'+id)
  },
}
const upload = {
  uploadFile (param:any,callback:any){
    return axios.post('/file/upload',param,{
      headers : {
          "Content-Type": "multipart/form-data;charset=UTF-8"
      },
    onUploadProgress: progressEvent => {
        callback(progressEvent);
      }
    })
  },
  fileDel(id:string){
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