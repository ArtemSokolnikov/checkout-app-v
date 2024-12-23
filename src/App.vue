<template>
  <v-app>
    <v-main>
      <AddressSelector />
      <CartSummary />
      <PaymentSelector />
      <OrderSummary />
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
};
</script>
<style src="./styles/global.css"></style>
