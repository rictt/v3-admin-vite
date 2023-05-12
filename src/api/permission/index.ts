import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createPermissionApi(data: Table.ICreateTableRequestData) {
  return request({
    url: "/permission/add",
    method: "post",
    data: {
      permission: data
    }
  })
}

/** 删 */
export function deletePermissionApi(id: string) {
  return request({
    url: `/permission/del`,
    method: "post",
    data: {
      permission: {
        id
      }
    }
  })
}

/** 改 */
export function updatePermissionApi(data: Table.IUpdateTableRequestData) {
  return request({
    url: "/permission/update",
    method: "post",
    data: {
      permission: data
    }
  })
}

/** 查 */
export function getPermissionListApi(params?: Table.IGetTableRequestData) {
  return request<{ data: any[] }>({
    url: "/permission/get",
    method: "post",
    params
  })
}
