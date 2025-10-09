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
import { dividerProps, ElMessage } from "element-plus"
import user_drawer from "./user_drawer.vue"
import depart_dialog from "./depart_dialog.vue"
import Menu1 from "./Menu1.vue"

// ==================== 元素绑定ref ====================
const user_drawer_ref = ref()
const Menu1Ref = ref()
const depart_dialog_ref = ref()
const ElTreeRef = ref()
const menu_tree_Ref = ref()
// ==================== 响应式数据 ====================
const ElTreeRefCurrNode = ref()
const user_list = ref([] as any[])
let finance_manage = ref(false)

// 右键菜单当前列表
const menu_curr_list = ref([] as any[])

const tree_depart = ref({
  data: [] as any[],
  currentNodeKey: undefined,
})

const tree_menu = ref([] as any[])

// 右键菜单部门列表
const menu_depart_list = ref([
  {
    label: "新增部门",
    click: async (item: any) => {
      let res: any = await api.depart.menu_premiss_tree()
      if (res.code != 200) return ElMessage.error(res.msg) //前置判断
      console.log("api.depart.menu_premiss_tree---res", res)

      // find_tree_menu_permiss
      let res2: any = await api.depart.find_tree_menu_permiss()
      console.log(`111---res2:`, res2)
      tree_menu.value = res2.result.menu_premiss_tree

      depart_dialog_ref.value.show = true
      depart_dialog_ref.value.title = item.label
      let form = ref({ name: "", parent_id: ElTreeRefCurrNode?.value?.id, role: "职员" })
      depart_dialog_ref.value.render = () => {
        return (
          <el-form model={form.value} label-width="120px">
            <el-form-item label={"父级id"} prop="parent_id">
              <el-input v-model={form.value.parent_id} />
            </el-form-item>
            <el-form-item label={"部门名称"} prop="name">
              <el-input v-model={form.value.name} />
            </el-form-item>

            <el-form-item label={"角色名称"} prop="role1">
              <el-input v-model={form.value.role} />
            </el-form-item>

            <>
              <el-tree
                class="tree_menu"
                ref="TreeMenuRef"
                style="width:100%; height: auto; overflow: auto"
                data={tree_menu.value}
                props={{ label: "name" }}
                node-key="id"
                highlight-current
                expand-on-click-node={false}
                default-expand-all
                v-slots={{
                  default: ({ node, data }: { node: any; data: any }) => {
                    return (
                      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", paddingRight: "8px" }}>
                        <span>{data.name}</span>

                        {data.type === "dir" ||
                          (data.type === "menu" && (
                            <div style={{ display: "flex", gap: "20px" }}>
                              <div class={`btn_normal ${data.is_view ? "btn_active" : ""}`} onClick={() => btn_click(data, "is_view")}>
                                显示
                              </div>
                              <div class={`btn_normal ${data.is_save ? "btn_active" : ""}`} onClick={() => btn_click(data, "is_save")}>
                                保存
                              </div>
                              <div class={`btn_normal ${data.is_del ? "btn_active" : ""}`} onClick={() => btn_click(data, "is_del")}>
                                删除
                              </div>

                              <div class={`btn_normal ${data.is_find ? "btn_active" : ""}`} onClick={() => btn_click(data, "is_find")}>
                                查询
                              </div>
                            </div>
                          ))}
                      </div>
                    )
                  },
                }}
              ></el-tree>
            </>
          </el-form>
        )
      }
      depart_dialog_ref.value.callback = function () {
        console.log("新增部门111")
        console.log("form", form.value)
        console.log("tree_menu", tree_menu.value)
      }
    },
  },
  {
    label: "编辑部门",
    click: (item: any) => {
      depart_dialog_ref.value.title = item.label

      depart_dialog_ref.value.show = true

      depart_dialog_ref.value.callback = function () {
        console.log("新增部门111")
      }
    },
  },
  {
    label: "新增角色",
    click: (item: any) => {
      depart_dialog_ref.value.title = item.label
      depart_dialog_ref.value.show = true
      depart_dialog_ref.value.callback = function () {
        console.log("新增角色111")
      }
    },
  },
])

// 右键菜单角色列表
const menu_role_list = ref([
  {
    label: "编辑角色",
    click: async (item: any) => {
      depart_dialog_ref.value.title = item.label
      depart_dialog_ref.value.show = true
      depart_dialog_ref.value.callback = async function () {
        const nodes = menu_tree_Ref.value.getCheckedNodes() //获取选中节点
        const nodes_id = nodes.map((item: any) => (item.type === "button" ? item.id : undefined)).filter((item: any) => item !== undefined) //获取选中节点的id
        console.log("nodes_id", nodes_id)
        let res: any = await api.depart.update_depart_menu({ role_id: ElTreeRefCurrNode.value.id, nodes_id })
        if (res.code != 200) return ElMessage.error(res.msg) //前置判断
        ElMessage.success(res.msg)
        depart_dialog_ref.value.show = false
      }

      // 渲染表单
      let res: any = await api.depart.find_depart_menu({ role_id: ElTreeRefCurrNode.value.id })

      tree_menu.value = res.result.menu_tree
      let checked_ids = res.result.checked_ids
      console.log("tree_menu", tree_menu.value)

      depart_dialog_ref.value.render = () => {
        return (
          <div>
            <el-tree
              show-checkbox
              class="menu_tree_Ref"
              ref={menu_tree_Ref}
              style="width: 100%; height: auto; overflow: auto"
              data={tree_menu.value}
              props={{ label: "name" }}
              default-checked-keys={checked_ids}
              node-key="id"
              highlight-current
              default-expand-all={true} //
              v-slots={{
                default: ({ node, data }: { node: any; data: any }) => {
                  if (data.type === "button") {
                    return <div class="ok_button ">{data.name}</div>
                  } else {
                    return <div class="no_button font-bold text-base">{data.name}</div>
                  }
                },
              }}
            ></el-tree>
          </div>
        )
      }
    },
  },
])

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

function btn_click(data: any, field: any) {
  if (data[field]) {
    data[field] = !data[field]
  } else {
    data[field] = true
  }
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
