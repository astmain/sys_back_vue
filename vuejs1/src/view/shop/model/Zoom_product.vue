<template>
  <main style="display: flex; gap: 10px">
    <!-- 商品 -->
    <nav style="border: 1px solid #000">
      <!-- 工具栏 -->
      <el-button size="small" @click="find_model_kind_tree()" type="info"> find_model_kind_tree </el-button>
      <el-cascader :options="tree_model_kind" v-model="tree_id_list" :props="cascader_props" placeholder="请选择分类" clearable multiple style="width: 100%"></el-cascader>

      <el-button size="small" @click="find_list_model_product()" type="primary"> find_list_model_product </el-button>
      <el-button size="small" @click="show_save_model_product = true" type="success"> save_model_product </el-button>

      <!-- 商品列表 -->
      <ul style="max-height: 500px; overflow-y: auto; padding-right: 10px">
        <li v-for="(item, index) in BUS.model.list_model_product" :key="item.id">
          <el-card shadow="hover" style="width: 400px" @click="BUS.model.selected_model_product = item">
            <nav style="display: flex; gap: 10px">
              <img :src="item.list_img.length > 0 ? item.list_img[0].url : ''" style="width: 100px; height: 100px" />
              <div style="display: flex; flex-direction: column; gap: 5px">
                <span>index:{{ index }}</span>
                <span>title:{{ item.title }}</span>
                <span>id:{{ item.id }}</span>
                <span>created_at:{{ item.created_at }}</span>
                <span>tb_model_kind:{{ item.tb_model_kind.map((o: any) => o.id + o.name) }}</span>
              </div>
            </nav>
            <el-button size="small" @click=";(show_save_model_product = true), (BUS.model.selected_model_product = item)" type="success"> show_save_model_product </el-button>
            <el-button size="small" @click="save_model_card()" type="primary" plain> save_model_card </el-button>
            <el-button size="small" @click="delete_ids_model_product(BUS.model.selected_model_product.id)" type="info"> delete_ids_model_product </el-button>
          </el-card>
        </li>
      </ul>

      <!-- 保存商品 -->
      <el-dialog title="show_save_model_product" width="500px" v-model="show_save_model_product" :close-on-click-modal="false">
        <nav style="max-height: 500px; overflow-y: auto; padding-right: 10px">
          <li class="css_form">
            <h4>种类</h4>
            <!-- <el-input v-model="form_save.kind_ids"></el-input> -->
            <el-cascader v-model="form_save.kind_ids" :options="tree_model_kind" :props="cascader_props" placeholder="请选择分类" clearable multiple style="width: 100%"></el-cascader>
          </li>

          <li class="css_form">
            <h4>模型标题</h4>
            <el-input v-model="form_save.title"></el-input>
          </li>
          <li class="css_form">
            <h4>模型格式</h4>
            <el-input v-model="form_save.type_format"></el-input>  
          </li>
          <li class="css_form">
            <h4>模型描述</h4>
            <el-input v-model="form_save.remark"></el-input>
          </li>

          <li class="css_form">
            <h4>图片</h4>
            <el-input v-model="form_save.list_img[0].url"></el-input>
          </li>

          <li class="css_form">
            <h4>文件</h4>
            <el-input v-model="form_save.list_file[0].url"></el-input>
          </li>

          <li class="css_form">
            <h4>个人价格</h4>
            <el-input v-model="form_save.price_personal"></el-input>
          </li>
          <li class="css_form">
            <h4>企业价格</h4>
            <el-input v-model="form_save.price_company"></el-input>
          </li>
          <li class="css_form">
            <h4>企业扩展价格</h4>
            <el-input v-model="form_save.price_extend"></el-input>
          </li>
          <li class="css_form">
            <h4>模型格式</h4>
            <el-input v-model="form_save.type_format"></el-input>
          </li>

          <li class="css_form">
            <h4>布线</h4>
            <el-input v-model="form_save.type_wiring"></el-input>
          </li>
          <li class="css_form">
            <h4>面积单位</h4>
            <el-input v-model="form_save.type_area"></el-input>
          </li>

          <li class="css_form">
            <h4>点数</h4>
            <el-input v-model="form_save.points"></el-input>
          </li>

          <li class="css_form">
            <h4>是否公开</h4>
            <el-switch v-model="form_save.is_public"></el-switch>
          </li>
          <li class="css_form">
            <h4>是否删除</h4>
            <el-switch v-model="form_save.is_deleted"></el-switch>
          </li>
          <li class="css_form">
            <h4>是否商用</h4>
            <el-switch v-model="form_save.is_business"></el-switch>
          </li>
          <li class="css_form">
            <h4>是否骨骼</h4>
            <el-switch v-model="form_save.is_skeleton"></el-switch>
          </li>
          <li class="css_form">
            <h4>是否动画</h4>
            <el-switch v-model="form_save.is_animation"></el-switch>
          </li>
          <li class="css_form">
            <h4>是否打印</h4>
            <el-switch v-model="form_save.is_print"></el-switch>
          </li>
          <li class="css_form">
            <h4>是否未塌陷</h4>
            <el-switch v-model="form_save.is_no_collapse"></el-switch>
          </li>
          <li class="css_form">
            <h4>是否没有塌陷</h4>
            <el-switch v-model="form_save.is_no_collapse"></el-switch>
          </li>
        </nav>

        <el-button size="small" @click="save_model_product()" type="primary"> save_model_product </el-button>
      </el-dialog>
    </nav>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { BUS } from '@/BUS'
import { ElMessage } from 'element-plus'
import { axios_api } from '@/config/axios_instance'
import _ from 'lodash'

// 响应式数据使用 $ref
let show_save_model_product = $ref<boolean>(false)

// 分类数据
let tree_model_kind = $ref<any>([])
let tree_id_list = $ref([] as any)
let cascader_props = $ref({ value: 'id', label: 'name', children: 'children', multiple: true, checkStrictly: true })

// 表单数据
const form_find = $ref({
  // 分页字段
  currentPage: 1,
  pageSize: 10,

  // 模糊搜索字段
  is_check: null,
  order_by: 'count_collect',
  order_type: 'asc',
  title: '',
  remark: '',
  is_public: null,
  is_deleted: false,
  is_business: null,
  is_skeleton: null,
  is_animation: null,
  is_print: null,
  is_no_collapse: null,
  is_copyright: null,
  is_texture: null,
  is_plug_in: null,
  is_chartlet:null,

  kind_ids: [] as number[],

  type_format :'' ,
  type_area:'' ,
  type_wiring:'' ,
  type_uv:'' ,

})

const form_save = $ref({
  kind_ids: [], //种类
  title: '标题', //标题
  remark: '描述', //描述
  is_public: true, //是否公开
  is_deleted: false, //是否删除
  is_business: true, //是否商用
  is_skeleton: true, //是否骨骼
  is_animation: true, //是否动画
  is_print: true, //是否打印
  is_no_collapse: true, //是否未塌陷


  type_uv: 'uv1', //uv
  type_wiring: 'wiring1', //布线
  type_area: 'area1', //面片数
  type_format: 'format1', //模型格式


  points: 666, //点数
  price_type: 'price_free', //价格类型
  price_free: 0, //免费价格
  price_personal: 111, //个人价格
  price_company: 1111, //企业价格
  price_extend: 11111, //企业扩展价格
  is_copyright: true, //是否版权

  is_chartlet: true, //是否有材质
  is_texture: true, //是否有贴图
  is_plug_in: true, //是否插件
  is_plug_in_remark: '', //是否插件
  list_wireframe :[], //线框图

  main_img: 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/car.png', //主图
  list_img: [{ url: 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/car.png', name: ''  ,size:100,size_format:'1MB'}], //图片
  // list_img: [], //图片
  list_file: [{ url: 'https://www.baidu.com/img/flexible/logo/pc/result.png', name: '',size:100,size_format:'1MB' }], //文件
  list_video: [], //视频
  list_extend: [], //扩展
  list_texture: [], //纹理
})

// const form_save = $ref({
//   kind_ids: [], //种类
//   title: '标题', //标题
//   remark: '描述', //描述
//   is_public: true, //是否公开
//   is_deleted: false, //是否删除
//   is_business: true, //是否商用
//   is_skeleton: true, //是否骨骼
//   is_animation: true, //是否动画
//   is_print: true, //是否打印
//   is_no_collapse: true, //是否未塌陷
//   model_format: '.stl', //模型格式

//   wiring: '三角形', //布线
//   area_unit: '5k以下', //面片数
//   points: 666, //点数
//   price_type: 'price_free', //价格类型
//   price_free: 0, //免费价格
//   price_personal: 111, //个人价格
//   price_company: 1111, //企业价格
//   price_extend: 11111, //企业扩展价格
//   is_copyright: true, //是否版权

//   is_chartlet: true, //是否有材质
//   is_texture: true, //是否有贴图
//   is_plug_in: true, //是否插件
//   is_plug_in_remark: '', //是否插件

//   main_img: 'https://www.baidu.com/img/flexible/logo/pc/result.png', //主图
//   list_img: [{ url: 'https://www.baidu.com/img/flexible/logo/pc/result.png', name: '' }], //图片
//   list_file: [{ url: 'https://www.baidu.com/img/flexible/logo/pc/result.png', name: '' }], //文件
//   list_video: [], //视频
//   list_extend: [], //扩展
//   list_texture: [], //纹理
// })

// 方法=======================================
const find_list_model_product = async () => {
  let aaa = tree_id_list
  console.log('tree_id_list', JSON.parse(JSON.stringify(aaa))) // [[1,2,3 ][1,2,3 ]]
  let arr_number = _.flattenDeep(tree_id_list) // [1,2,3,1,2,3]
  console.log(`111---arr_number:`, arr_number)

  form_find.kind_ids = arr_number as []
  // form_find.kind_ids = [1]
  // debugger
  const res: any = await axios_api.post('/model_api/find_list_model_product', form_find)
  console.log('find_list_model_product---res:', res)
  if (res.code === 200) {
    BUS.model.list_model_product = res.result.list
    ElMessage.success(res.msg)
  } else {
    ElMessage.error(res.msg)
  }
}

const save_model_product = async () => {
  let arr_number = _.flattenDeep(form_save.kind_ids)
  console.log(`111---form_save.kind_ids:`, JSON.parse(JSON.stringify(form_save.kind_ids)))
  console.log(`111---arr_number:`, arr_number)
  form_save.kind_ids = arr_number
  // form_save.kind_ids = ["arr_number"]
  const res: any = await axios_api.post('/model_api/save_model_product', form_save)
  console.log('save_model_product---res:', res)
  if (res.code === 200) {
    ElMessage.success(res.msg)
    find_list_model_product()
  } else {
    ElMessage.error(res.msg)
  }
}

const save_model_card = async () => {
  const form = {
    user_id: BUS.model.user_id,
    product_id: BUS.model.selected_model_product.id,
    price_type: 'price_personal',
    count: 1,
  }

  const res: any = await axios_api.post('/model_api/save_model_card', form)
  console.log('save_model_card---res:', res)
  if (res.code === 200) {
    ElMessage.success(res.msg)
    // const instance = getCurrentInstance()
    // console.log('instance?.parent?.refs.Zoom_cart:', instance?.parent?.refs.Zoom_cart)
    // ;(instance?.parent?.refs.Zoom_cart as any)?.find_list_model_card()
    BUS.model.find_list_model_card()
  } else {
    ElMessage.error(res.msg)
  }
}

const delete_ids_model_product = async (id: number) => {
  console.log('delete_ids_model_product---id:', id)
  const res: any = await axios_api.post(`/model_api/delete_ids_model_product`, {ids: [id]})
  console.log('delete_ids_model_product---res:', res)
  if (res.code === 200) {
    ElMessage.success(res.msg)
    find_list_model_product()
  } else {
    ElMessage.error(res.msg)
  }
}

async function find_model_kind_tree() {
  const res: any = await axios_api.get(`/model_api/find_model_kind_tree`)
  console.log('find_model_kind_tree---res:', res)

  if (res.code === 200) {
    ElMessage.success(res.msg)
    tree_model_kind = res.result
  } else {
    ElMessage.error(res.msg)
  }
}

// 生命周期
onMounted(async () => {
  await find_model_kind_tree()
  await find_list_model_product()
})
</script>

<style scoped></style>
