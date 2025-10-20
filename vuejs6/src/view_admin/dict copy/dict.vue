<template>
  <div class="flex gap-5">
    <!-- 左侧树形结构 -->
    <el-card class="w-200px">
      <nav>
        <el-button type="primary" @click="find_list_dict"> 查询 </el-button>
        <el-button type="primary" @click="save_dict_parent"> 新增 </el-button>
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

          <el-button type="primary" @click="dialog_save_dict = true">新增</el-button>
        </div>

        <el-table :data="list_dict_parent_current.children" stripe border>
          <el-table-column prop="name" label="名称" width="100" />
          <el-table-column prop="code" label="编码" width="200" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="status" label="状态" />
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="created_at" label="创建时间" width="200" />
        </el-table>
      </nav>
    </el-card>

    <el-dialog v-model="dialog_save_dict" title="保存" width="800px" draggable :close-on-click-modal="false">
      <div class="flex flex-col gap-8">
        <nav class="flex gap-4">
          <el-input v-model="form_save_dict.name">
            <template #prepend>名称</template>
          </el-input>

          <el-input v-model="form_save_dict.code">
            <template #prepend>编码</template>
          </el-input>
        </nav>

        <nav class="flex gap-4">
          <div class="flex items-center gap-2 w-[770px]">
            <span class="w-16">状态</span>
            <el-select v-model="form_save_dict.status">
              <el-option label="启动" :value="true" />
              <el-option label="禁用" :value="false" />
            </el-select>
          </div>

          <el-input v-model="form_save_dict.sort">
            <template #prepend>排序</template>
          </el-input>
        </nav>
        <el-input v-model="form_save_dict.remark" type="textarea" :rows="6" />
      </div>
      <template #footer>
        <el-button type="primary" @click="save_dict_children">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue"
import { api } from "@/api"
import { ElMessage } from "element-plus"

let list_dict_parent = $ref([] as any[])
let list_dict_parent_current = $ref({ name: "", code: "", remark: "", status: true, sort: 0, children: [] as any } as any)

let form_save_dict = $ref({ parent_id: "", id: "", name: "", code: "", remark: "", status: true, sort: 0 })
let dialog_save_dict = $ref(false)

onMounted(() => {
  find_list_dict()
})

async function find_list_dict() {
  const res: any = await api.dict.find_list_dict({ parent_id: undefined })
  console.log(`find_list_dict---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  list_dict_parent = res.result
}
async function save_dict_children() {
  let form = { parent_id: list_dict_parent_current.id, name: form_save_dict.name, code: form_save_dict.code, remark: form_save_dict.remark, status: form_save_dict.status, sort: form_save_dict.sort }
  const res: any = await api.dict.save_dict(form)
  console.log(`save_dict_children---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  ElMessage.success("保存成功")
  dialog_save_dict = false
  find_list_dict()
}

async function save_dict_parent() {
  let form = { name: form_save_dict.name, code: form_save_dict.code, remark: form_save_dict.remark, status: form_save_dict.status, sort: form_save_dict.sort }
  const res: any = await api.dict.save_dict(form)
  console.log(`save_dict_children---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  ElMessage.success("保存成功")
  dialog_save_dict = false
  find_list_dict()
}

async function handle_node_click(id: string) {
  console.log(`111---handle_node_click---id:`, id)
  console.log(`222---handle_node_click---list_dict_parent:`, list_dict_parent)

  list_dict_parent_current = list_dict_parent.find((item: any) => item.id === id)
}
</script>
