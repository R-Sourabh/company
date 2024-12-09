import { ActionTree } from "vuex"
import RootState from "@/store/RootState"
import * as types from "./mutation-types"
import { hasError } from "@/utils"
import logger from "@/logger"
import UtilState from "./UtilState"
import { UtilService } from "@/services/UtilService"

const actions: ActionTree<UtilState, RootState> = {

  async fetchFacilityGroups({ commit }) {
    let facilityGroups = [] as any;

    try {
      const resp = await UtilService.fetchFacilityGroups({ pageSize: 100 });

      if(!hasError(resp)) {
        facilityGroups = resp.data;
      } else {
        throw resp.data;
      }
    } catch(error: any) {
      logger.error(error);
    }
    commit(types.UTIL_FACILITY_GROUPS_UPDATED, facilityGroups);
  },
  
  async fetchFacilities({ state, commit }) {
    let facilities = [] as any, resp;

    try {
      resp = await UtilService.fetchFacilities({
        facilityTypeId: "VIRTUAL_FACILITY",
        facilityTypeId_op: "notEqual",
        parentTypeId: "VIRTUAL_FACILITY",
        parentTypeId_op: "notEqual",
        pageSize: 100 
      })

      if(!hasError(resp) && resp.data) {
        // need to change this check later.
        facilities = resp.data.filter((facility: any) => facility.externalId)
      } else {
        throw resp.data
      }
    } catch(error) {
      logger.error(error);
    }
    commit(types.UTIL_FACILITIES_UPDATED, facilities)
  },
  
  async fetchDBICCountries({ commit }) {
    let countries = [] as any;

    try {
      const resp = await UtilService.fetchDBICCountries({ geoIdTo: "DBIC", pageSize: 200 })
      if(!hasError(resp)) {
        countries = resp.data;
      } else {
        throw resp.data;
      }
    } catch(error: any) {
      logger.error(error);
    }
    commit(types.UTIL_DBIC_COUNTRIES_UPDATED, { list: countries, total: countries.length })
  },

  async fetchOperatingCountries({ commit, state }) {
    if(state.operatingCountries.length) return;

    let operatingCountries = [] as any;

    try {
      const resp = await UtilService.fetchOperatingCountries({ pageSize: 200 })
      if(!hasError(resp)) {
        operatingCountries = resp.data;
      } else {
        throw resp.data;
      }
    } catch(error: any) {
      logger.error(error);
    }
    commit(types.UTIL_OPERATING_COUNTRIES_UPDATED, operatingCountries)
  },

  async fetchProductIdentifiers({ commit, state }) {
    if(state.productIdentifiers.length) return;

    let productIdentifiers = [] as any;

    try {
      const resp = await UtilService.fetchEnums({ enumTypeId: "SHOP_PROD_IDENTITY" })
      if(!hasError(resp)) {
        productIdentifiers = resp.data;
      } else {
        throw resp.data;
      }
    } catch(error: any) {
      logger.error(error);
    }
    commit(types.UTIL_PRODUCT_IDENTIFIERS_UPDATED, productIdentifiers)
  },

  async fetchShipmentMethodTypes({ commit, state }, payload) {
    if(state.shipmentMethodTypes.length) return;

    let shipmentMethodTypes = [] as any;

    try {
      const resp = await UtilService.fetchShipmentMethodTypes(payload)
      if(!hasError(resp)) {
        shipmentMethodTypes = resp.data;
      } else {
        throw resp.data;
      }
    } catch(error: any) {
      logger.error(error);
    }
    commit(types.UTIL_SHIPMENT_METHOD_TYPES_UPDATED, shipmentMethodTypes)
  },

  async fetchOrganizationPartyId({ commit }) {
    let partyId = ""

    try {
      const resp = await UtilService.fetchOrganization({
        roleTypeId: 'INTERNAL_ORGANIZATIO',
        pageSize: 1
      })

      if(!hasError(resp)) {
        partyId = resp.data[0]?.partyId
      } else {
        throw resp.data
      }
    } catch (error) {
      logger.error(error)
    }
    commit(types.UTIL_ORGANIZATION_PARTY_ID_UPDATED, partyId)
  },

  async clearUtilState({ commit }) {
    commit(types.UTIL_CLEARED)
    commit(types.UTIL_ORGANIZATION_PARTY_ID_UPDATED, "")
  }
}

export default actions;