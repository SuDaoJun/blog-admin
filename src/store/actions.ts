import { StoreTypes } from './const'
import { StoreState } from './types'

export interface USERINFO {
  type: string,
  payload: StoreState["userInfo"]
}

export type ModifyAction = USERINFO

// 操作权限列表
export const setUserInfo = (payload:StoreState["userInfo"]):ModifyAction => ({
    type: StoreTypes.USERINFO,
    payload
})