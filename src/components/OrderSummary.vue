<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" class="d-flex align-center">
        <v-checkbox
          v-model="acceptedTerms"
          @change="updateAcceptedTerms"
          aria-label="Confirm the terms and conditions"
        />
        <span>I agree to the</span>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <span class="terms-link" v-bind="attrs" v-on="on">
               Terms and Conditions
            </span>
          </template>
          <div class="tooltip-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-btn class="customButton" color="success" @click="placeOrder"
          >Place Order</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      acceptedTerms: false,
      isCurrentOrder: this.$store.state.currentOrder,
    };
  },
  computed: {
    orderForPlacement() {
      return this.$store.state.currentOrder;
    },
    orderStatus() {
      return this.$store.state.order.id;
    },
  },
  methods: {
    updateAcceptedTerms() {
      this.$store.dispatch('setAcceptedTerms', this.acceptedTerms);
    },
    validateOrder() {
      if (!this.isCurrentOrder.addressId) {
        alert('Please choose address');
        return false;
      }
      if (!this.isCurrentOrder.paymentMethod) {
        alert('Please choose payment method');
        return false;
      }
      if (
        this.isCurrentOrder.paymentMethod === 'PurchaseOrder' &&
        !this.isCurrentOrder.purchaseOrderNumber
      ) {
        alert('Please enter your order number and click "Apply"');
        return false;
      }
      if (
        this.isCurrentOrder.paymentMethod === 'CreditCard' &&
        !this.isCurrentOrder.paymentInfoId
      ) {
        alert('Please choose credit card');
        return false;
      }
      if (!this.isCurrentOrder.termsAndConditionsAccepted) {
        alert('Please confirm the terms and conditions');
        return false;
      }
      return true;
    },
    placeOrder() {
      if (this.validateOrder()) {
        this.$store.dispatch('placeOrder', this.orderForPlacement);
      }
    },
  },
};
</script>
<style src="../styles/global.css" scoped>

</style>
