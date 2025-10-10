<template>
  <el-main style="display: flex; flex-direction: row; gap: 10px">
    <nav style="" class="uno_card">
      <el-tree
        class="user_tree_left"
        ref="ElTreeRef"
        style="width: 250px; height: auto; overflow: auto"
        :data="tree_depart.data"
        :props="{ label: 'name' }"
        node-key="id"
        :current-node-key="tree_depart.currentNodeKey"
        :expand-on-click-node="false"
        highlight-current
        default-expand-all
        @node-click="tree_left_click"
        @node-contextmenu="tree_ritht_click"
      >
      </el-tree>
    </nav>
    <nav style="flex: 1; padding: 0 !important" class="uno_card">
      <el-table :data="user_list" style="width: 100%; height: 100%" show-overflow-tooltip stripe :header-cell-style="{ background: '#f4f4f5', color: '#606266' }">
        <el-table-column type="index" width="60" label="序号" />
        <el-table-column prop="index" width="80" label="状态">
          <template #default="scope">
            <el-switch size="" v-model="scope.row.status" inline-prompt active-text="启用" inactive-text="禁用" />
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="姓名" width="110">
          <template #default="scope">
            <div class="flex items-center gap-2">
              <img :src="scope.row.avatar" alt="" class="w-[24px] rounded-full" />
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="full_depart_name" label="部门" width="300" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="user_drawer_ref.open(scope.row.id)">修改</el-button>
            <el-button link @click="remove_ids_user([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </nav>
  </el-main>
  <user_drawer ref="user_drawer_ref" />
  <Menu1 ref="Menu1Ref" :menu_list="menu_curr_list" />
  <depart_dialog ref="depart_dialog_ref" />
  <com_dialog_depart_create ref="ref_com_dialog_depart_create" />
</template>

<script setup lang="tsx">
import { onMounted, ref } from "vue"
import { api } from "@/api"
import { BUS } from "@/BUS"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { dividerProps, ElMessage } from "element-plus"
import user_drawer from "./user_drawer.vue"
import depart_dialog from "./depart_dialog.vue"
import Menu1 from "./Menu1.vue"
import com_dialog_depart_create from "./com_dialog_depart_create.vue"

// ==================== 元素绑定ref ====================
const user_drawer_ref = ref()
const Menu1Ref = ref()
const depart_dialog_ref = ref()
const ElTreeRef = ref()
const ref_com_dialog_depart_create = ref()
// ==================== 响应式数据 ====================
const ElTreeRefCurrNode = ref()
const user_list = ref([] as any[])
// 右键菜单当前列表
const menu_curr_list = ref([] as any[])
// 右键菜单部门角色列表
const menu_depart_role_list = ref([
  {
    label: "新增部门",
    click: async (item: any) => {
      ref_com_dialog_depart_create.value.title = item.label
      ref_com_dialog_depart_create.value.tree_node_curr = ElTreeRefCurrNode.value
      ref_com_dialog_depart_create.value.open()
    },
  },
  {
    label: "删除",
    click: async (item: any) => {
      if (!(await plugin_confirm())) return
      let res: any = await api.depart.delete_depart_role_ids({ ids: [ElTreeRefCurrNode.value.id] })
      if (res.code != 200) return ElMessage.error(res.msg) //前置判断
      ElMessage.success(res.msg)
      await find_tree_depart()
    },
  },
])

const tree_depart = ref({
  data: [] as any[],
  currentNodeKey: undefined,
})

// ✅用户管理树点击事件查询用户列表
async function tree_left_click() {
  Menu1Ref.value.hide_menu()
  ElTreeRefCurrNode.value = ElTreeRef.value.getCurrentNode()
  let res: any = await api.user.find_list_user({ depart_id: ElTreeRefCurrNode.value.id })
  console.log("api.user.find_list_user---res", res)
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  user_list.value = res.result.user_list
}
BUS.func.tree_left_click = tree_left_click //全局BUS函数

// ✅右键点击事件
function tree_ritht_click(event: MouseEvent, item: any) {
  event.preventDefault()
  Menu1Ref.value.show_menu(event)
  ElTreeRefCurrNode.value = item
  menu_curr_list.value = item.is_depart ? menu_depart_role_list.value : menu_depart_role_list.value.filter((item: any) => item.label == "删除")
}

// ✅删除用户
async function remove_ids_user(ids: string[]) {
  if (!(await plugin_confirm())) return
  let res: any = await api.user.remove_ids_user({ ids })
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  tree_left_click()
}

// ✅查询部门树
async function find_tree_depart() {
  let res: any = await api.user.find_tree_depart()
  console.log("api.user.find_tree_depart---res", res)
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  tree_depart.value.data = res.result.depart_tree
  console.log("tree_depart.value.data", JSON.parse(JSON.stringify(res.result.depart_tree)))
  BUS.depart_tree = res.result.depart_tree
}

onMounted(async () => {
  await find_tree_depart()
})
</script>

<style>
.btn_active {
  color: white;
  cursor: pointer;
  border-radius: 4px;
  background-color: #45a0ff;
  transition: all 0.3s ease;

  &:hover {
    background-color: #79bbff;
  }
}

.btn_normal {
  box-sizing: border-box;
  padding: 2px 6px;
  font-size: 12px;

  &:hover {
    background-color: #f5f7fa;
    color: #409eff;
  }
}

.desc_item {
  border: 0.5px solid #e5e5e5;
  min-height: 40px;
  min-width: 100px;
}
</style>

<style>
.el-tree-node__children:has(.ok_button) {
  display: flex !important;
}

.el-tree-node__children:has(.no_button) {
  display: block !important;
}
</style>
