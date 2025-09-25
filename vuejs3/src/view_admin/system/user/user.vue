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
        <el-table-column type="index" width="66" label="序号" />
        <el-table-column prop="avatar" label="姓名" width="110">
          <template #default="scope">
            <div class="flex items-center gap-2">
              <img :src="scope.row.avatar" alt="" class="w-[24px] rounded-full" />
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="full_depart_name" label="部门" width="auto" />
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
  <Menu1 ref="Menu1Ref" :menu_list="menu_list" @menu-click="switch_menu" />
  <depart_dialog ref="depart_dialog_ref" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { api } from "@/api"
import { BUS } from "@/BUS"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { ElMessage } from "element-plus"
import user_drawer from "./user_drawer.vue"
import depart_dialog from "./depart_dialog.vue"
import Menu1 from "./Menu1.vue"

// ==================== 元素绑定ref ====================
const user_drawer_ref = ref()
const Menu1Ref = ref()
const depart_dialog_ref = ref()
const ElTreeRef = ref()
// ==================== 响应式数据 ====================
const ElTreeRefCurrNode = ref()
const user_list = ref([] as any[])
const menu_list = ref([
  { label: "新增部门", action: "新增部门" },
  { label: "修改部门", action: "修改部门" },
  { label: "删除部门", action: "删除部门" },
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
function tree_ritht_click(event: MouseEvent, node: any) {
  event.preventDefault()
  Menu1Ref.value.show_menu(event)
  ElTreeRefCurrNode.value = node
}

// ✅菜单-选择器
async function switch_menu(item: any) {
  console.log("switch_menu---switch_menu", item)
  console.log("switch_menu---ElTreeRefCurrNode", JSON.parse(JSON.stringify(ElTreeRefCurrNode.value)))

  let title_prefix = item.is_depart ? "部门" : "角色"

  switch (item.action) {
    case "新增部门":
      depart_dialog_ref.value.title = "新增" + title_prefix
      depart_dialog_ref.value.open(ElTreeRefCurrNode.value.id)
      break
    case "修改部门":
      depart_dialog_ref.value.title = "修改" + title_prefix
      depart_dialog_ref.value.open(ElTreeRefCurrNode.value.id)
      break
    case "删除部门":
      depart_dialog_ref.value.title = "删除" + title_prefix
      depart_dialog_ref.value.open(ElTreeRefCurrNode.value.id)
      break
  }
}

// ✅删除用户
async function remove_ids_user(ids: string[]) {
  if (!(await plugin_confirm())) return
  let res: any = await api.user.remove_ids_user({ ids })
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  tree_left_click()
}

onMounted(async () => {
  let res: any = await api.user.find_tree_depart()
  console.log("api.user.find_tree_depart---res", res)
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  tree_depart.value.data = res.result.depart_tree
  console.log("tree_depart.value.data", JSON.parse(JSON.stringify(res.result.depart_tree)))
  BUS.depart_tree = res.result.depart_tree
})
</script>

<style scoped>
:deep(.depart_column .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}
</style>
