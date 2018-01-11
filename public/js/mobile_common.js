Vue.component('mini-cart', {
  props: ['items','lang'],
  template: `
    <div class="mini-cart" align = "right">
      <button id = "cart" @click="toggleCart" class="button button-medium button-plain button-borderless">
          <i class="fa fa-shopping-cart"></i>
      </button>
      <div class="cart" v-if="isShow">
        <button id = "cart" @click="toggleCart" class="button button-medium button-borderless">
            <i class="fa fa-shopping-cart"></i>
        </button>
        <div class="header">
          <span>product</span>
          <span>size</span>
          <span>amount</span>
        </div>
        <div v-for="item in itemsAdpter" class="order">
          <span>{{item.order.name}}</span>
          <span>{{item.order.size[0].toUpperCase()}}</span>
          <span>{{item.order.amount}}</span>
        </div>
        <div class="action">
          <a href="/mobile/cart">
            show
          </a>
        </div>
      </div>
    </div>
  `,
  data () {
    return {
      isShow: false,
    }
  },
  computed: {
    itemsAdpter () {
      let i = 1
      return this.items.map(item => {
        if (!item.order.recommendation) {
          item.order.name = `Own Juice ${i++}`
        }
        return item
      })
    }
  },
  methods: {
    toggleCart () {
      this.isShow = !this.isShow
    },
  }
});
