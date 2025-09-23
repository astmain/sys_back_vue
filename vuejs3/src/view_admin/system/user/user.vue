<template>
  <div>用户管理</div>

  <el-main style="display: flex; flex-direction: row; gap: 10px">
    <nav style="" class="uno_card">
      <el-tree
        class="user_tree_left"
        ref="ele-tree"
        style="width: 250px; height: auto; overflow: auto"
        :data="tree_depart.data"
        :props="tree_depart.props"
        :node-key="tree_depart.props.nodeKey"
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
      <el-table :data="user_list" style="width: 100%; height: 100%" stripe :header-cell-style="{ background: '#f4f4f5', color: '#606266' }">
        <el-table-column type="index" width="66" label="序号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="depart_id" label="部门" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="">修改</el-button>
            <el-button link @click="() => 1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </nav>
  </el-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { api } from "@/api"
import { ElMessage } from "element-plus"

const tree_depart = ref({
  data: [] as any[],
  currentNodeKey: undefined,
  props: {
    nodeKey: "id",
    label: "name",
  },
})

const user_list = ref([] as any[])

async function tree_left_click(node: any) {
  console.log("tree_left_click", node)
  let res: any = await api.user.find_list_user({ depart_id: node.id })
  console.log("api.user.find_list_user---res", res)
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断
  user_list.value = res.result.user_list
}

function tree_ritht_click(node: any) {
  console.log(node)
}

onMounted(async () => {
  let res: any = await api.user.find_tree_depart()
  console.log("api.user.find_tree_depart---res", res)
  if (res.code != 200) return ElMessage.error(res.msg) //前置判断

  tree_depart.value.data = res.result.depart_tree
  console.log("tree_depart.value.data", JSON.parse(JSON.stringify(res.result.depart_tree)))

  //   tree_depart.value.data = res.result.depart_tree
  //   console.log("tree_depart.value.data", JSON.parse(JSON.stringify(res.result.depart_tree)))
  // }
  //     name: "Level one 1",
  //     children: [],
  //   },
  // ]
})
</script>

<style scoped></style>
