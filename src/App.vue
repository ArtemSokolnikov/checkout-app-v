<template>
  <v-app>
    <v-main>
      <AddressSelector />
      <CartSummary />
      <PaymentSelector :resetResult="resetResult"  />
      <OrderSummary  @place-order="handlePlaceOrder" />
    </v-main>
  </v-app>
</template>

<script>
import AddressSelector from './components/AddressSelector.vue';
import CartSummary from './components/CartSummary.vue';
import PaymentSelector from './components/PaymentSelector.vue';
import OrderSummary from './components/OrderSummary.vue';

export default {
  components: {
    AddressSelector,
    CartSummary,
    PaymentSelector,
    OrderSummary,
  },
  data() {
    return {
      resetResult: null,
    };
  },
  methods:{
    resetPaymentMethod() {
      this.paymentMethod = null;
      this.selectedCard = null;
      this.purchaseOrderNumber = '';
      this.purchaseOrderTouched = false;
      return {
        paymentMethod: this.paymentMethod,
        selectedCard: this.selectedCard,
        purchaseOrderNumber: this.purchaseOrderNumber,
        purchaseOrderTouched: this.purchaseOrderTouched,
      };
    },
    handlePlaceOrder() {
      this.resetResult = this.resetPaymentMethod();
    },
  }
};
</script>
<style src="./styles/global.css"></style>
