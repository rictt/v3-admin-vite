import { request } from "@/utils/service"

const createData = <T>(data: T) => {
  return {
    ...data
    // vipPackageUser: {
    //   ...data
    // }
  }
}

export const getUserListApi = (params) => {
  return request({ url: "/admin/user/get", method: "post", params })
}
interface IAddUser {
  email: string
  password: string
}
export const createUserApi = (data: IAddUser) => {
  return request({ url: "/admin/user/add", method: "post", data: createData(data) })
}
export const updateUserApi = (data: IAddUser) => {
  return request({ url: "/admin/user/update", method: "post", data: createData(data) })
}
interface IDelUser {
  email: string
}
export const delUserApi = (data: IDelUser) => {
  return request({ url: "/admin/user/del", method: "post", data: createData(data) })
}
