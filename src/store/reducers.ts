import { ModifyAction } from './actions'
import { StoreTypes } from './const'
import { StoreState } from './types'

export let StoreStateData:StoreState = {
  // 用户信息
  userInfo: {
    status: '',
    avatarId: '',
    mark: '',
    _id: '',
    avatar: '',
    name: '',
    email: '',
    phone: '',
    password: null,
    roleId: {},
    createTime: '',
    updateTime: '',
    info: ''
  }
}
// 对action进行限制，必须是在ModifyAction定义的
export default (state = StoreStateData, action: ModifyAction):StoreState  => {
  const { type, payload } = action;
  switch (type) {
    case StoreTypes.USERINFO:
      let userInfo = payload;
      return { ...state, userInfo};
  }
  return state;
}