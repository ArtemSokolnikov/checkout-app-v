import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const API_KEY = 'C4D5C577E9914C4B9C9BF46DF9914A28';
const BASE_URL = 'https://du-mock-checkout-7d42d0a76fbf.herokuapp.com/api';

export default new Vuex.Store({
  state: {
    creditCards: [],
    addresses: [],
    countries: [],
    states: [],
    cart: null,
    couponCode: '',
    paymentMethods: [],
    currentOrder: {
      cartId: '',
      addressId: '',
      paymentMethod: '',
      paymentInfoId: '',
      purchaseOrderNumber: '',
      couponCode: '',
      termsAndConditionsAccepted: false,
    },
    order: {
      id: '',
    },
  },
  mutations: {
    SET_CREDIT_CARDS(state, cards) {
      state.creditCards = cards;
    },
    SET_ADDRESSES(state, addresses) {
      state.addresses = addresses;
    },
    SET_COUNTRIES(state, countries) {
      state.countries = countries;
    },
    SET_STATES(state, states) {
      state.states = states;
    },
    SET_CART(state, cart) {
      state.cart = cart;
    },
    SET_CURRENT_ORDER_CART_ID(state, id) {
      state.currentOrder.cartId = id;
    },
    SET_SELECTED_ADDRESS(state, address) {
      state.currentOrder.addressId = address;
    },
    SET_COUPON_CODE(state, couponCode) {
      state.currentOrder.couponCode = couponCode;
    },
    SET_PAYMENT_METHODS(state, methods) {
      state.paymentMethods = methods;
    },
    SET_SELECTED_PAYMENT_METHOD(state, method) {
      state.currentOrder.paymentMethod = method;
    },
    SET_PURCHASE_PAYMENT(state, purchaseOrder) {
      state.currentOrder.paymentInfoId = purchaseOrder;
    },
    SET_PURCHASE_PAYMENT_NUMBER(state, purchaseOrderNumber) {
      state.currentOrder.purchaseOrderNumber = purchaseOrderNumber;
    },
    SET_CREDIT_CARDS_PAYMENT(state, creditCardPayment) {
      state.currentOrder.paymentInfoId = creditCardPayment;
    },
    SET_SELECTED_CARD(state, cardId) {
      state.currentOrder.paymentInfoId = cardId;
    },
    REMOVE_SELECTED_CARD(state) {
      state.currentOrder.paymentInfoId = '';
    },
    SET_EMPTY_PURCHASE_ORDER(state) {
      state.currentOrder.purchaseOrderNumber = '';
    },
    SET_ACCEPTED_TERMS(state, valueOfTerms) {
      state.currentOrder.termsAndConditionsAccepted = valueOfTerms;
    },
    RESET_VALUES(state) {
      state.currentOrder = {
        addressId: '',
        paymentMethod: '',
        paymentInfoId: '',
        purchaseOrderNumber: '',
        couponCode: '',
        termsAndConditionsAccepted: false,
      };
    },
    SET_ORDER(state, order) {
      state.order = order;
    },
  },
  actions: {
    async fetchCreditCards({ commit }) {
      try {
        const response = await fetch(`${BASE_URL}/payment/creditcards`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        commit('SET_CREDIT_CARDS', data);
      } catch (error) {
        console.error(error);
      }
    },
    async addCreditCard({ dispatch }, card) {
      try {
        await fetch(`${BASE_URL}/payment/creditcards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(card),
        });
        dispatch('fetchCreditCards');
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCreditCard({ commit, dispatch }, id) {
      try {
        await fetch(`${BASE_URL}/payment/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        dispatch('fetchCreditCards');
        commit('REMOVE_SELECTED_CARD');
      } catch (error) {
        console.error(error);
      }
    },
    async selectPurchaseOrder({ commit }, purchaseOrderNumber) {
      try {
        const response = await fetch(
          `${BASE_URL}/payment/purchase-order/${purchaseOrderNumber}`,
          {
            method: 'PUT',
            headers: { Authorization: `Bearer ${API_KEY}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert('Purchase applied');
          commit('SET_PURCHASE_PAYMENT', data.id);
          commit('SET_PURCHASE_PAYMENT_NUMBER', purchaseOrderNumber);
        } else {
          const errorData = await response.json();
          alert(errorData);
          throw new Error(errorData || 'Failed to add coupon');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAddresses({ commit }) {
      try {
        const response = await fetch(`${BASE_URL}/address`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        commit('SET_ADDRESSES', data);
      } catch (error) {
        console.error(error);
      }
    },
    async addAddress({ dispatch }, address) {
      try {
        await fetch(`${BASE_URL}/address`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({ ...address, saved: true }),
        });
        dispatch('fetchAddresses');
      } catch (error) {
        console.error(error);
      }
    },
    async selectAddress({ commit }, address) {
      try {
        await fetch(`${BASE_URL}/address/select/${address}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(address),
        });
        commit('SET_SELECTED_ADDRESS', address);
      } catch (error) {
        console.error(error);
      }
    },
    async selectCard({ commit }, card) {
      commit('SET_SELECTED_CARD', card);
    },
    async setAcceptedTerms({ commit }, value) {
      commit('SET_ACCEPTED_TERMS', value);
    },
    async fetchCountries({ commit }) {
      try {
        const response = await fetch(`${BASE_URL}/address/countries`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        commit('SET_COUNTRIES', data);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchStates({ commit }, country) {
      try {
        const response = await fetch(`${BASE_URL}/address/states/${country}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        commit('SET_STATES', data);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchCart({ commit }) {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        const { id } = data;
        commit('SET_CART', data);
        commit('SET_CURRENT_ORDER_CART_ID', id);
      } catch (error) {
        console.error(error);
      }
    },
    async addCoupon({ commit, dispatch }, couponCode) {
      try {
        const response = await fetch(
          `${BASE_URL}/cart/coupon?couponCode=${couponCode}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({ couponCode }),
          }
        );
        if (response.ok) {
          alert('Coupon applied successfully!');
          commit('SET_COUPON_CODE', couponCode);
          dispatch('fetchCart');
        } else {
          const errorData = await response.json();
          alert(errorData);
          throw new Error(errorData || 'Failed to add coupon');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPaymentMethods({ commit }, paymentMethod) {
      try {
        commit('SET_SELECTED_PAYMENT_METHOD', paymentMethod);
        if (paymentMethod === 'CreditCard') {
          commit('SET_EMPTY_PURCHASE_ORDER');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async selectedPaymentMethod({ commit }) {
      try {
        const response = await fetch(`${BASE_URL}/payment/options`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await response.json();
        commit('SET_PAYMENT_METHODS', data);
      } catch (error) {
        console.error(error);
      }
    },
    async placeOrder({ commit }, orderDetails) {
      try {
        const response = await fetch(`${BASE_URL}/order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(orderDetails),
        });
        const data = await response.json();
        if (response.ok) {
          alert(`Order ${data.id} placed successfully!`);
          commit('SET_ORDER', data);
          commit('RESET_VALUES');

        } else {
          const errorData = await response.json();
          throw new Error(errorData || 'Failed to place Order');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
