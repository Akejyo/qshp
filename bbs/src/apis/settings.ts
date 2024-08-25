import request, { commonUrl } from '@/apis/request'

// import request from '@/apis/request'
// const commonUrl = 'http://222.197.183.89:65342/star/api/v1'

export type ChangePasswordResponse = {
  message: string
  data: string
  user: object
  system: object
}

export type UserProfile = {
  username: string
  biopermission: number
  bio: string
  customstatus: string
  sightml: string
}

export type UserPrivacy = {
  friendList: number
  messageBorad: number
}

export const checkPassword = (params: { uid: string; oldpassword: string }) => {
  return request.get(`${commonUrl}/auth/password`, { params: params })
}

export const changePassword = (params: {
  oldpassword: string
  newpassword: string
  email: string
  question: string
}) => {
  return request.patch<ChangePasswordResponse>(
    `${commonUrl}/auth/password`,
    params
  )
}

export const getPrivacy = (params: { uid: string }) => {
  return request.get<UserPrivacy>(`${commonUrl}/user/${params.uid}/me/privacy`)
}

export const setPrivacy = (params: {
  uid: string
  friend: number
  comment: number
}) => {
  return request.patch(`${commonUrl}/user/privacy`, params)
}

export const getProfile = () => {
  return request.get<UserProfile>(`${commonUrl}/get/me/profile`)
}

export const checkRename = (params: { uid: string }) => {
  return request.get(`${commonUrl}/user/${params.uid}/rename`)
}

export const setUsername = (params: {
  uid: string
  old_name: string
  new_name: string
}) => {
  return request.patch(`${commonUrl}/user/rename`, params)
}

export const setProfile = (params: {
  biopermisson: number
  bio: string
  customstatus: string
  sightml: string
}) => {
  return request.patch(`${commonUrl}/user/profile`, params)
}

export const setAvatar = (params: {
  avatars: Blob[]
  x0?: number
  x1?: number
  y0?: number
  y1?: number
}) => {
  return request.put(`${commonUrl}/user/avatar`, {
    params: params,
  })
}
