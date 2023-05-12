<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createUserApi, updateUserApi, delUserApi, getUserListApi } from "@/api/user"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { encryptoPassword } from "@/utils/crypto"

defineOptions({
  name: "PermissionList"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  email: "",
  password: ""
})
const formRules: FormRules = reactive({
  email: [{ required: true, trigger: "blur", message: "请输入" }],
  password: [{ required: true, trigger: "blur", message: "请输入" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createUserApi({
          email: formData.email,
          password: encryptoPassword(formData.password)
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateUserApi({
          email: formData.email,
          password: encryptoPassword(formData.password)
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
  formData.email = ""
  formData.password = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除：${row.email}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    delUserApi({ email: row.email }).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.email
  formData.email = row.email
  formData.password = ""
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref([])
const searchData = reactive({
  username: "",
  phone: ""
})
const getTableData = () => {
  loading.value = true
  getUserListApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  })
    .then((res: any) => {
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

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增</el-button>
        </div>
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" border>
          <el-table-column prop="ID" label="用户ID" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="LastLoginIP" label="上次登陆IP" align="center" />
          <el-table-column prop="CreatedAt" label="创建时间" align="center" />
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
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      width="500px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入" />
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
