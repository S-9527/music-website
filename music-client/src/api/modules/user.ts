import type { User } from '@/types'
import { get, getBaseURL, post } from '../request.ts'

interface SignInParams {
  username: string
  password: string
}

interface SignInByEmailParams {
  email: string
  password: string
}

export interface SignUpParams {
  username: string
  password: string
  sex: number | string
  phoneNum: string
  email: string
  birth: string | Date
  introduction: string
  location: string
}

interface UpdateUserMsgParams {
  id: string
  username: string
  sex: number
  phoneNum: string
  email: string
  birth: string
  introduction: string
  location: string
}

interface UpdateUserPasswordParams {
  id: string
  username: string
  oldPassword: string
  password: string
}

export const userAPI = {
  // 登录
  signIn: ({ username, password }: SignInParams) => post(`user/login/status`, { username, password }),
  signInByemail: ({ email, password }: SignInByEmailParams) => post(`user/email/status`, { email, password }),
  // 注册
  signUp: ({ username, password, sex, phoneNum, email, birth, introduction, location }: SignUpParams) => post(`user/add`, { username, password, sex, phoneNum, email, birth, introduction, location }),
  // 删除用户
  deleteUser: (id: string) => get(`user/delete?id=${id}`),
  // 更新用户信息
  updateUserMsg: ({ id, username, sex, phoneNum, email, birth, introduction, location }: UpdateUserMsgParams) => post(`user/update`, { id, username, sex, phoneNum, email, birth, introduction, location }),
  updateUserPassword: ({ id, username, oldPassword, password }: UpdateUserPasswordParams) => post(`user/updatePassword`, { id, username, oldPassword, password }),
  // 返回指定ID的用户
  getUserOfId: (id: string) => get<User[]>(`user/detail?id=${id}`),
  // 更新用户头像
  uploadUrl: (userId: string) => `${getBaseURL()}/user/avatar/update?id=${userId}`,
}
