<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-select
          :items="addresses"
          item-text="addressLine1"
          item-value="id"
          label="Choose Address"
          v-model="selectedAddress"
          @change="updateSelectedAddress"
          aria-label="Select address from list"
          required
        />
      </v-col>

      <v-col cols="12" md="8">
        <v-btn
          class="customButton"
          color="primary"
          @click="showAddAddressDialog = true"
          aria-label="Open dialog to add a new address"
        >
          Add New Address
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog
      v-model="showAddAddressDialog"
      max-width="500px"
      aria-labelledby="add-address-dialog"
    >
      <v-card>
        <v-card-title id="add-address-dialog">Add New Address</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="newAddress.addressLine1"
              label="Address Line 1"
              :rules="[isRequiredFieldRule]"
              aria-label="Enter address line 1"
              :aria-required="true"
            />
            <v-select
              :items="countries"
              label="Country"
              v-model="selectedCountry"
              @change="fetchStates"
              aria-label="Select a country"
              :rules="[isRequiredFieldRule]"
            />
            <v-select
              :items="states"
              label="State"
              v-model="newAddress.state"
              aria-label="Select a state"
              :rules="[isRequiredFieldRule]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="addNewAddress"
            aria-label="Save the new address"
          >
            Save
          </v-btn>
          <v-btn
            text
            @click="cancelAddressCard"
            aria-label="Cancel adding a new address"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showAddAddressDialog: false,
      newAddress: {
        id: null,
        addressLine1: '',
        state: '',
      },
      selectedCountry: null,
    };
  },
  computed: {
    addresses() {
      return this.$store.state.addresses;
    },
    countries() {
      return this.$store.state.countries;
    },
    states() {
      return this.$store.state.states;
    },
    selectedAddress: {
      get() {
        return this.$store.state.currentOrder.addressId;
      },
      set(value) {
        this.$store.commit('SET_SELECTED_ADDRESS', value);
      },
    },
  },
  methods: {
    updateSelectedAddress() {
      this.$store.dispatch('selectAddress', this.selectedAddress);
    },
    addNewAddress() {
      const form = this.$refs.form;
      if (form && form.validate()) {
        this.$store.dispatch('addAddress', this.newAddress).then(() => {
          this.showAddAddressDialog = false;
          this.newAddress = { addressLine1: '', state: '' };
        });
      } else {
        this.snackbarMessage = 'Please fix the validation errors.';
        this.snackbarVisible = true;
      }
    },
    fetchStates() {
      this.$store.dispatch('fetchStates', this.selectedCountry);
    },
    cancelAddressCard() {
      (this.newAddress = {
        id: null,
        addressLine1: '',
        state: '',
      }),
        this.$refs.form.reset();
      this.showAddAddressDialog = false;
    },
    isRequiredFieldRule(value) {
      if (!value) {
        return 'Please enter details';
      }
      return true;
    },
  },
  created() {
    this.$store.dispatch('fetchAddresses');
    this.$store.dispatch('fetchCountries');
  },
};
</script>

<style src="../styles/global.css" scoped></style>
