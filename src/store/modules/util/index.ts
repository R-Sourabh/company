import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"
import { Module } from "vuex"
import UtilState from "./UtilState"
import RootState from "@/store/RootState"

const utilModule: Module<UtilState, RootState> = {
  namespaced: true,
  state: {
    facilityGroups: [],
    facilities: [],
    operatingCountries: [],
    dbicCountries: {},
    productIdentifiers: [],
    shipmentMethodTypes: [],
    organizationPartyId: ""
  },
  getters,
  actions,
  mutations,
}

export default utilModule;