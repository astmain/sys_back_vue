<template>
  <!-- ✅文件列表工具栏 -->
  <el-form label-width="auto" label-position="left" style="max-width: 400px">
    <el-form-item label="token">
      <el-input v-model="BUS.token" placeholder="token"></el-input>
    </el-form-item>

    <el-form-item label="url">
      <el-select v-model="BUS.VITE_url_app_run" placeholder="Select">
        <el-option v-for="item in BUS.VITE_url_app_list" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
  </el-form>
  <el-button @click="得到token()">得到token</el-button>
  <el-radio-group v-model="path1" @change="find_dir_tree">
    <el-radio-button value="user" @click="">用户资源</el-radio-button>
    <el-radio-button value="web_set" @click="">网站设置资源</el-radio-button>
    <el-radio-button value="depart" @click="">部门资源</el-radio-button>
    <el-radio-button value="public" @click="">公共资源</el-radio-button>
  </el-radio-group>

  <div>
    <div style="display: flex; flex-direction: row; gap: 10px">
      <input type="file" id="file_input_file_sys" @change="change_input" hidden />
      <el-button @click="click_file_input">选择文件</el-button>
      <el-button type="primary" @click="file_upload_main">上传</el-button>
      <span>文件名: {{ file_obj ? (file_obj as any).name + ' 大小:' + (file_obj as any).size : '无文件' }}</span>
    </div>
  </div>

  <div class="" style="display: flex; flex-direction: row; gap: 10px">
    <!-- ✅左布局 -->
    <nav class="flex flex-col" style="border: 1px solid #ccc; width: 330px">
      <!-- ✅树状结构工具栏 -->
      <div>
        <el-button @click="find_dir_tree">find_dir_tree</el-button>
      </div>

      <!-- ✅树状结构 -->
      <el-tree ref="tree_depart_ref" style="width: 300px; box-sizing: border-box; height: 500px; overflow: auto" @node-contextmenu="tree_right_click" @node-click="tree_left_click" :data="tree_depart.data" :props="tree_depart.props" :current-node-key="tree_depart.currentNodeKey" :expand-on-click-node="false" highlight-current default-expand-all>
        <template #default="{ node, data }">
          <span style="display: flex; align-items: center; gap: 4px" :class="'__node__' + data.id">
            <!-- <i class="ci-folder" style="font-size: 14px; color: #409eff" v-if="data.is_file === false"></i>
          <i class="ci-domain-log" style="font-size: 14px; color: black" v-else></i> -->
            <span style="display: flex; align-items: center; gap: 4px">📁 {{ data.name }}</span>
          </span>
        </template>
      </el-tree>
    </nav>

    <nav style="border: 1px solid #ccc; width: 100%">
      <!-- ✅文件列表 -->
      <div style="">
        <div v-for="item in tree_struct" :key="item.id">
          <span style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 5px" @click="click_is_dir(item)">
            <span style="display: flex; flex-direction: row; gap: 10px; align-items: center; flex: 1">
              <i v-if="item.is_file === false" style="font-size: 14px; color: #409eff">📁 </i>
              <i v-else class="ci-domain-log" style="font-size: 14px; color: black"></i>
              <span>{{ item.name }}</span>
            </span>
            <span style="width: 120px">{{ item.size }}</span>
            <div style="display: flex; flex-direction: row; gap: 10px; font-size: 12px">
              <span @click="find_file_url(item)">查看</span>
              <span @click="download_file(item)">下载</span>
              <span @click="static_delete_id(item.id)">删除</span>
            </div>
          </span>
        </div>
      </div>
    </nav>
  </div>
  <!-- ✅右键菜单 -->
  <Menu1 ref="menu_ref" :menu_list="menu_list" @menu-click="switch_menu" />
  <!-- ✅创建文件夹弹窗 -->
  <el-dialog v-model="form_dialog.show" :title="form_dialog.title" width="30%">
    <el-input v-model="form_dialog.name" placeholder="请输入文件夹名称" />
    <el-button @click="switch_dialog">确定</el-button>
  </el-dialog>

  <h3>tree_curr(当前的树节点)</h3>
  <pre>{{ tree_curr }}</pre>
  <h3>tree_struct(当前文件列表)</h3>
  <pre>{{ tree_struct }}</pre>
</template>
<script lang="ts">
import { tool_upload, axios_oss } from './tool_upload'
import { ElMessage } from 'element-plus'
import Menu1 from './Menu1.vue'
import axios from 'axios'
import { BUS } from '../../../BUS'

export default {
  components: {
    Menu1,
  },
  data() {
    return {
      BUS: BUS,
      VITE_url_app_run: (import.meta as any).env['VITE_url_app_run'],
      path1: 'user' as 'user' | 'web_set' | 'depart' | 'public',
      file_obj: null,

      tree_curr: {} as any,
      tree_struct: [] as any[],
      tree_depart: {
        data: [] as any[],
        currentNodeKey: null,
        props: { label: 'name', nodeKey: 'id' },
      },

      // ✅菜单列表
      menu_list: [
        { label: '创建文件夹', action: '创建文件夹' },
        { label: '重命名', action: '重命名' },
        { label: '删除', action: '删除' },
      ],
      form_dialog: {
        title: '创建文件夹',
        name: '',
        show: false,
      },
    }
  }, ////
  methods: {
    async 得到token() {
      console.log(import.meta.env.VITE_token)
    },

    change_input(e: any) {
      this.file_obj = e.target.files[0]
    },
    click_file_input() {
      document.getElementById('file_input_file_sys')?.click()
    },
    async file_upload_main() {
      if (!this.file_obj) return alert('请选择文件')
      const file = this.file_obj
      const path_static = this.tree_curr.path_static
      const callback = (merge_res: any) => {
        if (merge_res.code === 200) {
          console.log(`合并结果---merge_res---111:`, merge_res)
          ElMessage.success(`⬆️merge_res.msg`)
        } else {
          console.log(`合并结果---merge_res---222:`, merge_res)
          ElMessage.error(`❌merge_res.msg`)
        }
      }
      await tool_upload({ file, path_static: path_static, callback })
    },

    async find_dir_tree() {
      const res: any = await axios_oss.post('/oss_api/find_dir_tree', { path1: this.path1 })
      console.log(`res:`, res)
      if (res.code === 200) {
        this.tree_depart.data = res.result
        ElMessage.success(res.msg)
      } else {
        ElMessage.error(res.msg)
      }
    },

    async find_dir_struct({ path_static }: { path_static: string }) {
      const res: any = await axios_oss.post('/oss_api/find_dir_struct', { path_static })
      console.log(`res:`, res)
      if (res.code === 200) {
        this.tree_struct = res.result
        ElMessage.success(res.msg)
      } else {
        ElMessage.error(res.msg)
      }
    },

    async static_rename({ id, name }: { id: number; name: string }) {
      const res: any = await axios_oss.post('/oss_api/static_rename', { id, name })
      if (res.code === 200) {
        ElMessage.success(res.msg)
        this.find_dir_tree()
      } else {
        ElMessage.error(res.msg)
      }
    },

    async static_delete_id(id: number) {
      const res: any = await axios_oss.post('/oss_api/static_delete_id', { id })
      if (res.code === 200) {
        ElMessage.success(res.msg)
        this.find_dir_tree()
        this.find_dir_struct({ path_static: this.tree_curr.path_static })
      } else {
        ElMessage.error(res.msg)
      }
    },

    async find_file_url(item: any) {
      console.log(`find_file_url:`, item)
      const res: any = await axios_oss.post('/oss_api/find_file_url', { id: item.id })
      if (res.code === 200) {
        console.log(`res:`, res.result)
        ElMessage.success(res.msg)
        const { url } = res.result
        window.open(url, '_blank')
      } else {
        ElMessage.error(res.msg)
      }
    },

    async download_file(item: any) {
      console.log(`find_file_url:`, item)
      const res: any = await axios_oss.post('/oss_api/find_file_url', { id: item.id })
      if (res.code === 200) {
        console.log(`res:`, res.result)
        ElMessage.success(res.msg)
        const { url_download } = res.result
        window.open(url_download, '_blank')
        return res.result
      } else {
        ElMessage.error(res.msg)
      }
    },

    click_is_dir(item: any) {
      console.log(`click_is_dir:`, item)
      if (item.is_file === false) {
        console.log(`click_is_dir:`, item.id)
        // @ts-ignore
        document.querySelector(`.__node__${item.id}`)?.click() // 其实应该点击 el-tree的 选中节点,但是操作无效,所以用 document.querySelector 选中节点
        // tree_depart_ref.value?.setCheckedKeys([item.id], false) // 树状结构 点击 选中
        this.find_dir_struct({ path_static: item.path_static })
      }
    },

    async static_create_dir({ name, path_static }: { name: string; path_static: string }) {
      const res: any = await axios_oss.post('/oss_api/static_create_dir', { name, path_static })
      if (res.code === 200) {
        ElMessage.success(res.msg)
        this.find_dir_tree()
        this.form_dialog.show = false
        ElMessage.success(res.msg)
      } else {
        ElMessage.error(res.msg)
      }
      console.log(`res:`, res)
    },

    // ✅左键点击事件
    tree_left_click(curr: any) {
      this.tree_curr = curr
      this.find_dir_struct({ path_static: curr.path_static })
    },

    // ✅右键点击事件
    tree_right_click(event: MouseEvent, data: any) {
      console.log('tree_right_click', event, data) //有打印数据,但是菜单没有显示
      event.preventDefault()
      // 右键菜单显示由Menu1内部管理
      this.tree_curr = data
      // @ts-ignore
      this.$refs['menu_ref'].show_menu(event)
    },
    // ✅菜单-选择器
    switch_menu(item: any) {
      this.form_dialog.name = ''
      switch (item.action) {
        case '创建文件夹':
          this.form_dialog.title = '创建文件夹'
          this.form_dialog.show = true
          break
        case '重命名':
          this.form_dialog.title = '重命名'
          this.form_dialog.show = true
          break
        case '删除':
          this.static_delete_id(this.tree_curr.id)
          break
        default:
          alert('switch_menu-未匹配')
      }
    },
    // ✅弹窗-选择器
    switch_dialog() {
      // const id = this.tree_curr.id
      // const parent_id = this.tree_curr.parent_id
      const id = this.tree_curr.id
      const path_static = this.tree_curr.path_static
      const name = this.form_dialog.name
      const path1 = this.path1

      switch (this.form_dialog.title) {
        case '创建文件夹':
          this.static_create_dir({ name, path_static })
          break
        case '重命名':
          this.static_rename({ id, name })
          break
        default:
          alert('switch_dialog-未匹配')
          break
      }
    },
  }, ////
  async mounted() {
    this.find_dir_tree()

    console.log(`111---`, import.meta.env)
    // for (const key of (import.meta as any).env) {
    //   console.log(`111---`,     key        )
    //
    // }

    //遍历对象
    const arr = []
    for (const key in import.meta.env) {
      // console.log(`111---`,     key        )
      if (key.includes('VITE_url_app')) {
        let url = import.meta.env[key]
        let item = { value: url, label: url }
        arr.push(item)
      }
    }

    BUS.VITE_url_app_list = arr as any[]

    console.log(`arr---`, arr)
    console.log(`VITE_url_ap_list---`, BUS.VITE_url_app_list)

    // let  list= ((import.meta as any).env).map(o=>  o.includes("VITE_url_app") ? o :"" ).filter(Boolean)

    // console.log(`list---`,     list        )
    // BUS.VITE_url_app_run=this.VITE_url_app_run
  },
}
</script>
<style scoped></style>
