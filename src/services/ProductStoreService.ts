import api from "@/api"

const createProductStore = async (payload: any): Promise <any>  => {
  return api({
    url: `productStores`,
    method: "post",
    data: payload
  });
}

const fetchCurrentStoreSettings = async (productStoreId: any): Promise <any>  => {
  return api({
    url: `productStores/${productStoreId}/settings`,
    method: "get"
  });
}

const fetchProductStoreDetails = async (productStoreId: any): Promise <any>  => {
  return api({
    url: `productStores/${productStoreId}`,
    method: "get"
  });
}

const fetchProductStores = async (): Promise <any>  => {
  return api({
    url: "productStores",
    method: "get"
  });
}

const fetchProductStoresFacilityCount = async (): Promise <any>  => {
  return api({
    url: "productStores/facilities/counts",
    method: "get"
  });
}

const updateProductStore = async (payload: any): Promise <any>  => {
  return api({
    url: `productStores/${payload.productStoreId}`,
    method: "post",
    data: payload
  });
}

export const ProductStoreService = {
  createProductStore,
  fetchCurrentStoreSettings,
  fetchProductStoreDetails,
  fetchProductStores,
  fetchProductStoresFacilityCount,
  updateProductStore
}