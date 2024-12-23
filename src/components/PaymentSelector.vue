<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-radio-group
          v-model="paymentMethod"
          @change="updatePaymentMethod"
          aria-labelledby="payment-method-label"
        >
          <p id="payment-method-label" class="sr-only">Select Payment Method</p>
          <v-radio
            label="Credit Card"
            value="CreditCard"
            :aria-checked="paymentMethod === 'CreditCard'"
          />
          <v-radio
            label="Purchase Order"
            value="PurchaseOrder"
            :aria-checked="paymentMethod === 'PurchaseOrder'"
          />
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row v-if="paymentMethod === 'CreditCard'" justify="center">
      <v-col cols="12" md="8">
        <v-select
          :items="creditCards"
          item-text="cardNumber"
          label="Select Credit Card"
          v-model="selectedCard"
          @change="updateSelectedCard"
          item-value="id"
          aria-describedby="card-selection-description"
        />
      </v-col>
      <v-col cols="12" md="8">
        <v-btn
          class="customButton"
          color="primary"
          @click="showAddCardDialog = true"
          aria-label="Add a new credit card"
        >
          Add New Card
        </v-btn>
        <v-btn
          color="error"
          class="customButton"
          @click="deleteCard(selectedCard)"
          v-if="selectedCard"
          :aria-label="`Delete card ending in ${selectedCard?.cardNumber?.slice(
            -4
          )}`"
        >
          Delete Card
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog
      v-model="showAddCardDialog"
      max-width="500px"
      aria-labelledby="add-card-title"
      aria-describedby="add-card-description"
    >
      <v-card>
        <v-card-title id="add-card-title">Add New Credit Card</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="newCard.cardNumber"
              label="Card Number"
              aria-label="Enter card number"
              @input="formatCardNumber"
              :rules="[cardNumberValidationRule]"
              maxlength="19"
            />
            <v-text-field
              v-model="newCard.expiryMonth"
              label="Expiry Month"
              aria-label="Enter expiry month"
              :rules="[onlyNumbersRule]"
              maxlength="2"
            />
            <v-text-field
              v-model="newCard.expiryYear"
              label="Expiry Year"
              aria-label="Enter expiry year"
              :rules="[onlyNumbersRule]"
              maxlength="4"
            />
            <v-text-field
              v-model="newCard.cvv"
              label="CVV"
              aria-label="Enter card security code (CVV)"
              :rules="[onlyNumbersRule]"
              maxlength="3"
            />
            <v-text-field
              v-model="newCard.cardHolderName"
              label="Cardholder Name"
              :rules="[onlyLettersRule]"
              aria-label="Enter the cardholder's name"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addNewCard" aria-label="Save new card">
            Save
          </v-btn>
          <v-btn text @click="cancelCard" aria-label="Cancel adding new card">
            Cancel
          </v-btn>
        </v-card-actions>
        <!-- Snackbar for validation errors -->
        <v-snackbar v-model="snackbarVisible" :timeout="3000">
          {{ snackbarMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="snackbarVisible = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-card>
    </v-dialog>

    <v-row justify="center"  v-if="paymentMethod === 'PurchaseOrder'">
      <v-col cols="12" sm="8" md="6" >
        <v-text-field
        label="Purchase Order Number"
        v-model="purchaseOrderNumber"
        aria-label="Enter the purchase order number"
        maxlength="12"
        outlined
        dense
        :rules="[minLengthRule, onlyNumbersRule]"
      />
      </v-col>
      <v-col cols="12" sm="4" md="2" >
        <v-btn
        color="primary"
        block
        @click="selectPurchaseOrder"
        aria-label="Apply Purchase Order"
        >Apply number </v-btn
      >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      paymentMethod: null,
      selectedCard: null,
      purchaseOrderNumber: '',
      showAddCardDialog: false,
      snackbarVisible: false,
      snackbarMessage: '',
      newCard: {
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardHolderName: '',
        saved: true,
      },
      minLengthRule: (value) => {
        return value.length >= 5 || 'Minimum 5 digits required';
      },
    };
  },
  computed: {
    creditCards() {
      return this.$store.state.creditCards;
    },
  },
  methods: {
    updateSelectedCard() {
      this.$store.dispatch('selectCard', this.selectedCard);
    },
    updatePaymentMethod() {
      this.$store.dispatch('fetchPaymentMethods', this.paymentMethod);
    },
    addNewCard() {
      const form = this.$refs.form;
      if (form && form.validate()) {
        this.$store.dispatch('addCreditCard', this.newCard).then(() => {
          this.showAddCardDialog = false;
          this.newCard = {
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
            cardHolderName: '',
          };
        });
      } else {
        this.snackbarMessage = 'Please fix the validation errors.';
        this.snackbarVisible = true;
      }
    },
    cancelCard() {
      this.newCard = {
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardHolderName: '',
      };
      this.$refs.form.reset();

      this.showAddCardDialog = false;
    },

    deleteCard(id) {
      this.$store.dispatch('deleteCreditCard', id);
    },
    selectPurchaseOrder() {
      if (this.paymentMethod === 'PurchaseOrder' && this.purchaseOrderNumber) {
        this.$store.dispatch('selectPurchaseOrder', this.purchaseOrderNumber);
      }
    },
    formatCardNumber(value) {
      if (value === null || value === undefined || value === '') {
        this.newCard.cardNumber = '';
        return;
      }
      const cleanedValue = value.replace(/\D/g, '');
      const formattedValue = cleanedValue.match(/.{1,4}/g)?.join(' ') || '';
      this.newCard.cardNumber = formattedValue;
    },
    cardNumberValidationRule(value) {
      if (!value) {
        return 'Please enter details';
      }
      const cleanedValue = value.replace(/\s/g, '');
      if (!/^[0-9]{16}$/.test(cleanedValue)) {
        return 'Card number must be exactly 16 digits';
      }
      if (!/^\d{4}(\s\d{4}){3}$/.test(value)) {
        return 'Card number must be formatted as 4 digits, 4 digits, 4 digits, 4 digits (e.g. 1234 5678 9012 3456)';
      }
      return true;
    },
    onlyNumbersRule(value) {
      if (!value) {
        return 'Please enter details';
      }
      return /^[0-9]*$/.test(value) || 'Please type only numbers';
    },
    onlyLettersRule(value) {
      if (!value) {
        return 'Please enter details';
      }
      return /^[a-zA-Z ]*$/.test(value) || 'Please type only latin letters';
    },
  },
  created() {
    this.$store.dispatch('fetchCreditCards');
    this.$store.dispatch('selectedPaymentMethod');
  },
};
</script>

<style src="../styles/global.css" scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
