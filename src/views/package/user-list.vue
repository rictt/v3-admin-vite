<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { setUserPackageApi, delUserPackageApi, updateUserPackageApi, getPackageUserListApi } from "@/api/package/user"
import { getPermissionListApi } from "@/api/permission"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { useUserPackageHook, DurationList, calcEndTime } from "./user-list"
import Selection from "@/components/Selection/index.vue"

defineOptions({
  name: "PermissionUserList"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const { userListOps, packageListOps } = useUserPackageHook()
//#region 增
const permissionList = ref([])
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  users_id: "",
  vip_package_id: null,
  end_time: null
})
const formRules: FormRules = reactive({
  users_id: [{ required: true, trigger: "blur", message: "不能为空" }],
  vip_package_id: [{ required: true, trigger: "blur", message: "不能为空" }],
  end_time: [{ required: true, trigger: "blur", message: "不能为空" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        setUserPackageApi({
          users_id: formData.users_id,
          vip_package_id: formData.vip_package_id,
          end_time: calcEndTime(formData.end_time)
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateUserPackageApi({
          users_id: formData.users_id,
          vip_package_id: formData.vip_package_id,
          end_time: calcEndTime(formData.end_time)
        }).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          getTableData()
        })
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.end_time = ""
  formData.users_id = ""
  formData.vip_package_id = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除：${row.users_id}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    delUserPackageApi({
      users_id: row.users_id,
      vip_package_id: row.vip_package_id
    }).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.users_id
  // formData.username = row.username
  formData.users_id = row.users_id
  formData.vip_package_id = row.vip_package_id
  formData.end_time = ""
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const getTableData = () => {
  loading.value = true
  getPackageUserListApi({
    page: 1,
    pageSize: 10
  })
    .then((res: any) => {
      console.log(res)
      if (res.data) {
        paginationData.total = res.data.total
        tableData.value = res.data.users
      }
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleRefresh = () => {
  getTableData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

onMounted(() => {
  getPermissionListApi().then((res) => {
    if (res.data) {
      console.log(res.data)
      permissionList.value = res.data
    }
  })
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" border>
          <el-table-column prop="users_id" label="用户ID" align="center" width="100" />
          <el-table-column prop="vip_package_id" label="套餐ID" align="center" width="100" />
          <el-table-column prop="created_at" label="创建时间" align="center">
            <template #default="scope">
              {{ new Date(scope.row.created_at).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="生效时间" align="center">
            <template #default="scope">
              {{ new Date(scope.row.start_time).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="失效时间" align="center">
            <template #default="scope">
              {{ new Date(scope.row.end_time).toLocaleString() }}
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户套餐' : '修改用户套餐'"
      @close="resetForm"
      width="500px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="users_id" label="用户">
          <Selection v-model="formData.users_id" :options="userListOps" />
        </el-form-item>
        <el-form-item prop="vip_package_id" label="套餐">
          <Selection v-model="formData.vip_package_id" :options="packageListOps" />
        </el-form-item>
        <el-form-item prop="end_time" label="增加时长">
          <Selection v-model="formData.end_time" :options="DurationList" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
