export interface ICreateTableRequestData {
  name: string
  description: string
  value: {
    [key: string]: any
  }
}

export interface IUpdateTableRequestData {
  id: string
  name: string
  value: any
  description: any
}

export interface IGetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  username?: string
  /** 查询参数：手机号 */
  phone?: string
}

export interface IGetTableData {
  createTime: string
  email: string
  id: string
  phone: string
  roles: string
  status: boolean
  username: string
}

export type GetTableResponseData = IApiResponseData<{
  list: IGetTableData[]
  total: number
}>
