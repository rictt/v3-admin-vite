import { getUserListApi } from "@/api/user"
import { getVipPackageListApi } from "@/api/package/index"
import { computed, onMounted, ref } from "vue"

export const DurationList = [
  { value: 1, label: "1小时" },
  { value: 6, label: "6小时" },
  { value: 12, label: "12小时" },
  { value: 24, label: "1天" },
  { value: 72, label: "3天" },
  { value: 24 * 7, label: "7天" }
]

export const calcEndTime = (code: number) => {
  // 返回秒
  const date = Date.now() / 1000
  return Number((date + code * 60 * 60).toFixed(0))
}

export function useUserPackageHook() {
  const userList = ref([])
  const packageList = ref([])

  onMounted(() => {
    getUserList()
    getPackageList()
  })

  const getUserList = () => {
    getUserListApi({
      page: 1,
      pageSize: 100
    }).then((res: any) => {
      if (res.data) {
        userList.value = res.data.users
      }
    })
  }

  const getPackageList = () => {
    getVipPackageListApi({
      page: 1,
      pageSize: 500
    }).then((res: any) => {
      if (res.data) {
        packageList.value = res.data
      }
    })
  }

  const toOptions = (list, labelKey, valueKey) => {
    if (!list) return []
    return list.map((e) => {
      return {
        label: e[labelKey],
        value: e[valueKey]
      }
    })
  }

  const userListOps = computed(() => {
    return toOptions(userList.value, "email", "ID")
  })
  const packageListOps = computed(() => {
    return toOptions(packageList.value, "name", "id")
  })

  return {
    userList,
    packageList,
    userListOps,
    packageListOps
  }
}
