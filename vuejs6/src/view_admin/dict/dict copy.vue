<template>
  <div class="flex gap-5">
    <!-- 左侧树形结构 -->
    <el-card class="w-200px">
      <nav>
        <el-button type="primary" @click="find_list_dict"> 查询 </el-button>
        <el-button type="primary" @click="save_dict('新增字典父级')"> 新增 </el-button>
      </nav>

      <nav class="flex flex-col gap-2 mr-5">
        <div v-for="(item, index) in list_dict_parent">
          <div @click="handle_node_click(item.id)">{{ item.name }}</div>
        </div>
      </nav>
    </el-card>
    <!-- 右侧表单 -->
    <el-card>
      <nav class="flex flex-col gap-2">
        <div class="flex gap-2">
          <el-input v-model="list_dict_parent_current.name">
            <template #prepend>名称</template>
          </el-input>

          <el-input v-model="list_dict_parent_current.code">
            <template #prepend>编码</template>
          </el-input>

          <el-button type="primary" @click="save_dict('新增字典子级')">新增</el-button>
          {{ curr_child.id }}
        </div>

        <el-table :data="list_dict_parent_current.children" stripe border>
          <el-table-column prop="name" label="名称" width="200" />
          <el-table-column prop="code" label="编码" width="200" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="status" label="状态" />
          <el-table-column prop="sort" label="排序" />
          <!-- <el-table-column prop="created_at" label="创建时间" width="200" /> -->
          <el-table-column prop="sort" label="编辑" width="200">
            <template #default="scope">
              <el-button type="primary" @click="() => ((curr_child = scope.row), save_dict('编辑字典子级'))">编辑</el-button>
              <el-button type="" @click="() => remove_dict_ids([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </nav>
    </el-card>

    <com_dialog_dict id="ref_com_dialog_dict" ref="ref_com_dialog_dict" />
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue"
import { api } from "@/api"
import { ElMessage } from "element-plus"

import com_dialog_dict from "./com_dialog_dict.vue"
import { plugin_confirm } from "@/plugins/plugin_confirm"

let list_dict_parent = $ref([] as any[])
let list_dict_parent_current = $ref({ name: "", code: "", remark: "", status: true, sort: 0, children: [] as any } as any)
let curr_child = $ref({} as any)

let form_save_dict = $ref({ parent_id: "", id: "", name: "", code: "", remark: "", status: true, sort: 0 })
let dialog_save_dict = $ref(false)

async function find_list_dict() {
  const res: any = await api.dict.find_list_dict({ parent_id: undefined })
  console.log(`find_list_dict---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  list_dict_parent = res.result
}

async function save_dict(title: string) {
  let ctx = (document.getElementById("ref_com_dialog_dict") as any)?.__vnode.ctx.exposed
  // debugger
  ctx.title.value = title
  ctx.show.value = true
  if (title === "新增字典父级") {
    ctx.form.value.id = ""
    ctx.form.value.parent_id = ""
    ctx.callback.value = async () => {
      let form = ctx.form.value
      let res: any = await api.dict.save_dict(form)
      if (res.code !== 200) return ElMessage.error(res.msg)
      ElMessage.success(res.msg)
      await find_list_dict()
    }
  }
  if (title === "新增字典子级") {
    ctx.form.value.id = ""
    ctx.form.value.parent_id = list_dict_parent_current.id
  }

  if (title === "编辑字典父级") {
    ctx.form.value.id = list_dict_parent_current.id
    ctx.form.value.parent_id = list_dict_parent_current.parent_id
  }

  if (title === "编辑字典子级") {
    ctx.form.value.id = curr_child.id
    ctx.form.value.parent_id = curr_child.parent_id
  }

  ctx.callback.value = async () => {
    let form = ctx.form.value
    let res: any = await api.dict.save_dict(form)
    if (res.code !== 200) return ElMessage.error(res.msg)
    ElMessage.success(res.msg)
    await find_list_dict()
  }
}

async function handle_child_click(id: string) {
  console.log(`111---handle_node_click---id:`, id)
  console.log(`222---handle_node_click---list_dict_parent:`, list_dict_parent)

  list_dict_parent_current = list_dict_parent.find((item: any) => item.id === id)
}

async function handle_node_click(id: string) {
  console.log(`111---handle_node_click---id:`, id)
  console.log(`222---handle_node_click---list_dict_parent:`, list_dict_parent)

  list_dict_parent_current = list_dict_parent.find((item: any) => item.id === id)
}

async function remove_dict_ids(ids: string[]) {
  if (!(await plugin_confirm())) return
  let res: any = await api.dict.remove_dict_ids({ ids })
  if (res.code !== 200) return ElMessage.error("失败:删除")
  ElMessage.success("成功:删除")
  await find_list_dict()
}
onMounted(async () => {
  await find_list_dict()

  let one = list_dict_parent.at(0)
  handle_node_click(one.id)
})
</script>
