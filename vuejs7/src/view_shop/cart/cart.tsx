import { defineComponent, onMounted } from "vue"
import { ElButton } from "element-plus"
import { api } from "@/api"
import { BUS } from "@/BUS"

let list_group_card = $ref<any[]>([])

// border: "1px solid #e4e7ed", "border-radius": "12px", padding: "12px 12px", height: "auto", "box-sizing": "border-box", "box-shadow": "0px 0px 12px rgba(0,0,0,0.12)"
export default defineComponent({
  name: "cart",
  setup() {
    onMounted(() => find_list_shop_cart())
    return () => (
      <div>
        {list_group_card.map((item) => (
          <div
            style={{
              border: "1px solid #e4e7ed", 
              "border-radius": "8px",
              overflow: "hidden",
              height: "auto",
              "box-sizing": "border-box",
              "box-shadow": "0px 0px 12px rgba(0, 0, 0, 0.12)",
            }}
          >
            {/* 商家卡片 */}
            <div class="flex gap-2 bg-gray-100 p-2 items-center">
              <div class="text-orange-400 font-bold">商家:{item.name}</div>
            </div>

            {/* 商品卡片 */}
            <div class="flex flex-col  p-4">
              {item.cart.map((cart: any) => (
                <div class="flex gap-2">
                  <img class="w-100px h-100px" src={cart.product.main_img} />
                  <nav class="flex flex-col gap-2">
                    <div>标题:{cart.product.title}</div>
                    <div>价格:{cart.product.price_num}</div>
                  </nav>
                  {button_remove({ className: "ml-auto", card_id: cart.card_id })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
})

async function find_list_shop_cart() {
  const res: any = await api.shop_cart.find_list_shop_cart({ user_id: BUS.user.id })
  console.log("find_list_shop_cart---res", res)
  if (res.code !== 200) return alert("错了")
  list_group_card = res.result.list_group_card

  console.log("list_shop_cart", JSON.parse(JSON.stringify(res.result)))
}

async function remove_shop_cart_ids(card_id: string) {
  const res: any = await api.shop_cart.remove_shop_cart_ids({ ids: [card_id] })
  console.log("remove_shop_cart_ids---res", res)
  if (res.code !== 200) return alert("错了")
  find_list_shop_cart()
}

function button_remove({ className, card_id }: { className: string; card_id: string }) {
  return (
    <div class={className}>
      <ElButton
        link
        type="info"
        onClick={async () => {
          const res: any = await api.shop_cart.remove_shop_cart_ids({ ids: [card_id] })
          console.log("remove_shop_cart_ids---res", res)
          if (res.code !== 200) return alert("错了")
          find_list_shop_cart()
        }}
      >
        删除
      </ElButton>
    </div>
  )
}
