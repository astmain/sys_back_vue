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
  <Menu1 ref="Menu1Ref" :menu_list="menu_curr_list" />
  <depart_dialog ref="depart_dialog_ref" />
</template>

<script setup lang="tsx">
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

// 右键菜单当前列表
const menu_curr_list = ref([] as any[])

// 右键菜单部门列表
const menu_depart_list = ref([
  {
    label: "新增部门",
    click: async (item: any) => {
      let res: any = await api.depart.menu_premiss_tree()
      if (res.code != 200) return ElMessage.error(res.msg) //前置判断
      console.log("api.depart.menu_premiss_tree---res", res)

      // find_tree_menu_permiss
      let res2 = await api.depart.find_tree_menu_permiss()
      console.log(`111---res2:`, res2)

      depart_dialog_ref.value.open()
      depart_dialog_ref.value.title = item.label
      let form = ref({ name: "", parent_id: ElTreeRefCurrNode?.value?.id, role1: "职员", role2: "主管" })
      depart_dialog_ref.value.form_view = () => {
        return (
          <el-form model={form.value} label-width="120px">
            <el-form-item label={"父级id"} prop="parent_id">
              <el-input v-model={form.value.parent_id} />
            </el-form-item>
            <el-form-item label={"部门名称"} prop="name">
              <el-input v-model={form.value.name} />
            </el-form-item>

            <el-form-item label={"职员名称"} prop="role1">
              <el-input v-model={form.value.role1} />
            </el-form-item>
            <el-form-item label={"主管名称"} prop="role2">
              <el-input v-model={form.value.role2} />
            </el-form-item>
            <>
            <el-tree
        class="user_tree_left"
        ref="ElTreeRef"
        style="width: 250px; height: auto; overflow: auto"
        

        node-key="id"

        highlight-current
        default-expand-all
 
      >
      </el-tree>
            
            </>
          </el-form>







        )
      }
      depart_dialog_ref.value.callback = function () {
        console.log("新增部门111")
        console.log("form", form.value)
      }
    },
  },
  {
    label: "重命名部门",
    click: (item: any) => {
      depart_dialog_ref.value.title = item.label
      depart_dialog_ref.value.open()
      depart_dialog_ref.value.callback = function () {
        console.log("新增部门111")
      }
    },
  },
  {
    label: "删除部门",
    click: (item: any) => {
      depart_dialog_ref.value.title = item.label
      depart_dialog_ref.value.open()
      depart_dialog_ref.value.callback = function () {
        console.log("新增部门111")
      }
    },
  },
  {
    label: "新增角色",
    click: (item: any) => {
      depart_dialog_ref.value.title = item.label
      depart_dialog_ref.value.open()
      depart_dialog_ref.value.callback = function () {
        console.log("新增角色111")
      }
    },
  },
])

// 右键菜单角色列表
const menu_role_list = ref([
  {
    label: "修改角色",
    click: (item: any) => {
      depart_dialog_ref.value.title = item.label
      depart_dialog_ref.value.open()
      depart_dialog_ref.value.callback = function () {
        console.log("修改角色111")
      }
    },
  },
  {
    label: "删除角色",
    click: (item: any) => {
      depart_dialog_ref.value.title = item.label
      depart_dialog_ref.value.open()
      depart_dialog_ref.value.callback = function () {
        console.log("删除角色111")
      }
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
  menu_curr_list.value = item.is_depart ? menu_depart_list.value : menu_role_list.value
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

<style scoped></style>
