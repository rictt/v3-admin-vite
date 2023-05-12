import { request } from "@/utils/service"

const createData = <T>(data: T) => {
  return {
    vipPackageUser: {
      ...data
    }
  }
}

export const getPackageUserListApi = (params) => {
  return request({ url: "/billing/get", method: "post", params })
}
interface IAddUser {
  users_id: string
  vip_package_id: number
  end_time: number
}
export const setUserPackageApi = (data: IAddUser) => {
  return request({ url: "/billing/add", method: "post", data: createData(data) })
}
type IUpdateUser = Pick<IAddUser, "users_id"> & Partial<IAddUser>
export const updateUserPackageApi = (data: IUpdateUser) => {
  return request({ url: "/billing/update", method: "post", data: createData(data) })
}
interface IDelUser {
  users_id: string
  vip_package_id: number
}
export const delUserPackageApi = (data: IDelUser) => {
  return request({ url: "/billing/del", method: "post", data: createData(data) })
}
