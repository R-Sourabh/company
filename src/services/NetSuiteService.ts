import api from "@/api"

const fetchProductStoreShipmentMethods = async (productStoreId: any): Promise<any> => {
  return api({
    url: `oms/productStores/${productStoreId}/shipmentMethods`,
    method: "get",
  })
}

const fetchPaymentMethods = async (payload: any): Promise <any> => {
  return api({
    url: "admin/paymentMethodTypes",
    method: "get",
    params: payload
  });
}

const fetchfacilitiesIdentifications = async (payload: any): Promise <any> => {
  return api({
    url: "facilities/identifications",
    method: "get",
    params: payload
  })
}

const updateFacilityIdentification = async (payload: any): Promise <any> => {
  return api({
    url: "facilities/identifications",
    method: "post",
    data: payload
  })
}

const fetchIntegrationTypeMappings = async (payload: any): Promise <any> => {
  return api({
    url: "admin/integrationTypeMappings",
    method: "get",
    params: payload
  })
}

const addIntegrationTypeMappings = async (payload: any): Promise <any> => {
  return api({
    url: "admin/integrationTypeMappings",
    method: "post",
    data: payload
  })
}

const updateIntegrationTypeMappings = async (payload: any, integrationMappingId: any): Promise <any> => {
  return api({
    url: `admin/integrationTypeMappings/${integrationMappingId}`,
    method: "post",
    data: payload
  })
}

const removeIntegrationMappingValue = async (payload: any): Promise <any> => {
  return api({
    url: `admin/integrationTypeMappings/${payload}`,
    method: "delete"
  })
}

const fetchShopifyTypeMappings = async (payload: any): Promise <any> => {
  return api({
    url: "oms/shopifyShops/typeMappings",
    method: "get",
    params: payload
  })
}

const fetchShopifyShopsCarrierShipments = async (payload: any): Promise <any> => {
  return api({
    url: "oms/shopifyShops/carrierShipments",
    method: "get",
    params: payload
  })
}
// TODO: need to add dynamic api to update the sftp configs.
const updateSftpConfig = async (payload: any): Promise <any> => {
  return api({
    url: "updateSftp",
    method: "post",
    data: payload
  })
}

const addEnumCode = async (payload: any): Promise <any> => {
  return api({
    url: "admin/enums",
    method: "post",
    data: payload
  })
}

export const NetSuiteService = {
  addEnumCode,
  addIntegrationTypeMappings,
  fetchIntegrationTypeMappings,
  fetchPaymentMethods,
  fetchProductStoreShipmentMethods,
  fetchShopifyTypeMappings,
  fetchShopifyShopsCarrierShipments,
  fetchfacilitiesIdentifications,
  removeIntegrationMappingValue,
  updateFacilityIdentification,
  updateIntegrationTypeMappings,
  updateSftpConfig
}