<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <h2 class="text-h5" aria-level="2">Your Cart</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="item in cart.items" :key="item.id">
                <v-list-item-avatar>
                  <v-img :src="item.product.imageUrl" alt="Product image"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.product.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    SKU: {{ item.product.sku }} | Size/Color: {{ item.product.sizeColor }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{ item.quantity }} x ${{ item.product.price.toFixed(2) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <strong>${{ (item.quantity * item.product.price).toFixed(2) }}</strong>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-divider class="my-3"></v-divider>

            <!-- Coupon Code Input -->
            <v-row >
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="couponCode"
                  label="Coupon Code"
                  placeholder="Enter your coupon of style MyCouponXX "
                  outlined
                  dense
                  aria-label="Coupon Code Input"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-btn color="primary" block @click="applyCoupon" aria-label="Apply Coupon">Apply Coupon</v-btn>
              </v-col>
            </v-row>

            <!-- Totals -->
            <div class="text-right">
              <div><strong>Subtotal:</strong> ${{ cart.subtotal.toFixed(2) }}</div>
              <div><strong>Shipping:</strong> ${{ cart.shipping.toFixed(2) }}</div>
              <div><strong>Tax:</strong> ${{ cart.tax.toFixed(2) }}</div>
              <div class="text-h6 mt-2"><strong>Total:</strong> ${{ cart.total.toFixed(2) }}</div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      couponCode: '',
    };
  },
  computed: {
    cart() {
            return this.$store.state.cart || { items: [], subtotal: 0,shipping: 0,tax: 0, total: 0, discount: 0 };
    },
  },
  created() {
    this.$store.dispatch('fetchCart');
  },
  methods: {
    async applyCoupon() {
      if (!this.couponCode) {
        alert('Please enter a coupon code.');
        return;
      }
      try {
        await this.$store.dispatch('addCoupon', this.couponCode);
        this.couponCode = '';
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.text-right {
  text-align: right;
}
.line-through {
  text-decoration: line-through;
}
.v-list-item-avatar {
  margin-right: 16px;
}
</style>
