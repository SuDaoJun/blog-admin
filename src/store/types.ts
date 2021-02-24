// store数据类型
export interface StoreState{
  // 用户信息
  userInfo: {
    status: string,
    avatarId: string,
    mark: string,
    _id: string,
    avatar: string,
    name: string,
    email: string,
    phone: string,
    password: string | null,
    roleId: any,
    createTime: string,
    updateTime: string,
    info: string
  }
}