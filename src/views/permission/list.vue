<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createPermissionApi, deletePermissionApi, updatePermissionApi, getPermissionListApi } from "@/api/permission"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

defineOptions({
  name: "PermissionList"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  username: "",
  password: "",
  name: "",
  description: "",
  value: {
    max: "",
    model: ""
  }
})
const formRules: FormRules = reactive({
  // username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  // password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  name: [{ required: true, trigger: "blur", message: "请输入名称" }],
  value: [
    { required: true, trigger: "blur", message: "请输入权配置" },
    {
      validator: (rules, value, cb) => {
        const { max, model } = formData.value
        // if (!max || !model) {
        if (!max) {
          return cb(new Error("请完整输入权限配置"))
        }
        cb()
      }
    }
  ],
  description: [{ required: true, trigger: "blur", message: "请输入权限描述" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createPermissionApi({
          name: formData.name,
          description: formData.description,
          value: formData.value
          // username: formData.username,
          // password: formData.password
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updatePermissionApi({
          id: currentUpdateId.value,
          name: formData.name,
          description: formData.description,
          value: formData.value
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
  formData.username = ""
  formData.password = ""
}
//#endregion

//#region 删
const handleDelete = (row: IGetTableData) => {
  ElMessageBox.confirm(`正在删除：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deletePermissionApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  console.log("row.id: ", row.id)
  // formData.username = row.username
  formData.name = row.name
  formData.description = row.description
  formData.value = row.value ? { ...row.value } : {}
  console.log("row.value: ", row.value)
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: "",
  phone: ""
})
const getTableData = () => {
  loading.value = true
  getPermissionListApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  })
    .then((res) => {
      paginationData.total = res.data.length || 0
      tableData.value = res.data
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getTableData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <!-- <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card> -->
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增权限</el-button>
          <!-- <el-button type="danger" :icon="Delete">批量删除</el-button> -->
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
          <el-table-column prop="id" label="ID" align="center" width="100" />
          <el-table-column prop="name" label="名称" align="center" />
          <el-table-column prop="value" label="权限配置" align="center">
            <template #default="scope">
              <div>
                <div class="flex" v-for="(value, key) in scope.row.value" :key="key">
                  <span class="min-w-[50px]">{{ key }}：</span>
                  <span>{{ value }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="权限描述" align="center" />
          <el-table-column prop="created_at" label="创建时间" align="center">
            <template #default="scope">
              {{ new Date(scope.row.created_at).toLocaleDateString() }}
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>

          <!-- <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="roles" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column> -->
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
        <el-form-item prop="name" label="名称">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="权限描述">
          <el-input v-model="formData.description" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="value" label="权限配置">
          <!-- <el-input v-model="formData.password" placeholder="请输入" /> -->
          <div class="w-full">
            <div class="flex">
              <span class="min-w-[100px]">模型：</span>
              <el-input v-model.trim="formData.value.model" />
            </div>
            <div class="flex">
              <span class="min-w-[100px]">Token数：</span>
              <el-input v-model.trim.number="formData.value.max" />
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="currentUpdateId === undefined">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item> -->
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
