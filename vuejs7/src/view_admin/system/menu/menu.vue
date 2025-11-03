<template>
  <div>菜单管理</div>

  <el-card class=" mb-5">
    <nav class="flex justify-between">
      <el-input style="width: 300px" v-model="menu_name" placeholder="菜单名称">
        <template #prepend>🔎</template>
      </el-input>

      <div>
        <el-button type="primary" @click="save_menu">新增菜单</el-button>
      </div>
    </nav>
  </el-card>

  <nav class="flex gap-5">
    <el-card>
      <el-tree ref="ElTreeRef" style="width: 300px; height: auto; overflow: auto" :data="menu_tree" :props="{ label: 'name' }" node-key="id" :expand-on-click-node="false" highlight-current default-expand-all @node-click="tree_left_click" @node-contextmenu="tree_ritht_click"> </el-tree>
    </el-card>

    <el-card class="flex-1">
      <div class="flex flex-col gap-4">
        <nav class="flex justify-between items-center">
          <h1>{{ menu_curr_item.name }}</h1>
          <el-button type="" @click="">编辑</el-button>
        </nav>

        <el-card class="">
          <h1>基本信息</h1>
          <ul class="flex flex-col gap-2 mt-4">
            <li class="flex gap-8">
              <div>菜单名称:</div>
              <div>{{ menu_curr_item.name }}</div>
            </li>
            <li class="flex gap-8">
              <div>菜单路径:</div>
              <div>{{ menu_curr_item.path }}</div>
            </li>
          </ul>
        </el-card>

        <el-card>
          <h1>备注信息</h1>
          <div class="mt-4">{{ menu_curr_item.remark }}</div>
        </el-card>
      </div>
    </el-card>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { api } from "@/api"
import { ElMessage } from "element-plus"

// ==================== 响应式数据 ====================
const menu_name = ref("") //菜单名称
const menu_tree = ref([] as any[]) //菜单树
const menu_curr_item = ref({} as any) //菜单当前项

// ✅查询菜单树
async function find_tree_menu() {
  let res: any = await api.menu.find_tree_menu()
  menu_tree.value = res.result.menu_tree
}

// ✅新增菜单
function save_menu() {
  alert("等待开发-新增菜单")
}

// ✅树点击事件
function tree_left_click(item: any) {
  console.log("tree_left_click", item)
  menu_curr_item.value = item
}

// ✅树右键点击事件
function tree_ritht_click(node: any) {
  console.log("tree_ritht_click", node)
}

onMounted(async () => {
  await find_tree_menu()
})
</script>

<style scoped></style>
