import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createVipPackageApi(data: Table.ICreateTableRequestData) {
  return request({
    url: "/package/add",
    method: "post",
    data: {
      package: data
    }
  })
}

/** 删 */
export function deleteVipPackageApi(id: string) {
  return request({
    url: `/package/del`,
    method: "post",
    data: {
      package: {
        id
      }
    }
  })
}

/** 改 */
export function updateVipPackageApi(data: Table.IUpdateTableRequestData) {
  return request({
    url: "/package/update",
    method: "post",
    data: {
      package: data
    }
  })
}

/** 查 */
export function getVipPackageListApi(params: Table.IGetTableRequestData) {
  return request<{ data: any[] }>({
    url: "/package/get",
    method: "post",
    params
  })
}
