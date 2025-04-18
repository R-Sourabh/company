import axios from "axios";
import { setupCache } from "axios-cache-adapter"
import OfflineHelper from "@/offline-helper"
import emitter from "@/event-bus"
import store from "@/store";


axios.interceptors.request.use((config: any) => {
  // TODO: pass csrf token
  const token = store.getters["user/getUserToken"];
  if (token) {
    config.headers["api_key"] =  token;
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// TODO: need to update this as per the changes in the Moqui response format, if required.
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  // TODO: explore more on a secure way to store the csrf token
  // Cannot store it in cookies or localStorage as its not safe
  // https://stackoverflow.com/questions/67062876/is-it-secure-to-store-a-csrf-token-value-in-the-dom
  // https://stackoverflow.com/questions/62289684/what-is-the-correct-way-for-a-client-to-store-a-csrf-token
  const csrfToken = response.headers["x-csrf-token"]
  const meta = document.createElement("meta")
  meta.name = "csrf"
  meta.content = csrfToken
  document.getElementsByTagName("head")[0].appendChild(meta)

  document.cookie = `x-csrf-token=${csrfToken}`

  return response;
}, function (error) {
  // TODO Handle it in a better way
  // Currently when the app gets offline, the time between adding a loader and removing it is fractional due to which loader dismiss is called before loader present
  // which cause loader to run indefinitely
  // Following gives dismiss loader a delay of 100 microseconds to get both the actions in sync
  setTimeout(() => emitter.emit("dismissLoader"), 100);
  if (error.response) {
    // TODO Handle case for failed queue request
    const { status } = error.response;
    // if (status === StatusCodes.UNAUTHORIZED) {
    //   store.dispatch("user/logout");
    //   const redirectUrl = window.location.origin + '/login';
    //   // Explicitly passing isLoggedOut as in case of maarg apps we need to call the logout api in launchpad
    //   window.location.href = `${process.env.VUE_APP_LOGIN_URL}?redirectUrl=${redirectUrl}&isLoggedOut=true`;
    // }
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

const maxAge = process.env.VUE_APP_CACHE_MAX_AGE ? parseInt(process.env.VUE_APP_CACHE_MAX_AGE) : 0;
const axiosCache = setupCache({
  maxAge: maxAge * 1000
})


/**
 * Generic method to call APIs
 *
 * @param {string}  url - API Url
 * @param {string=} method - "GET", "PUT", "POST", "DELETE , and "PATCH"
 * @param {any} [data] - Optional: `data` is the data to be sent as the request body. Only applicable for request methods "PUT", "POST", "DELETE , and "PATCH"
 * When no `transformRequest` is set, must be of one of the following types:
 * - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
 * - Browser only: FormData, File, Blob
 * - Node only: Stream, Buffer
 * @param {any} [params] - Optional: `params` are the URL parameters to be sent with the request. Must be a plain object or a URLSearchParams object
 * @param {boolean} [cache] - Optional: Apply caching to it
 *  @param {boolean} [queue] - Optional: Apply offline queueing to it
 * @return {Promise} Response from API as returned by Axios
 */
const api = async (customConfig: any) => {
  // Prepare configuration
  const config: any = {
    url: customConfig.url,
    method: customConfig.method,
    data: customConfig.data,
    params: customConfig.params,
    // withCredentials: true
  }

  const baseURL = store.getters["user/getInstanceUrl"];

  if (baseURL) {
    config.baseURL = baseURL.startsWith('http') ? baseURL.includes('/rest/s1/') ? baseURL : `${baseURL}/rest/s1/` : `https://${baseURL}.hotwax.io/rest/s1/`;
  }

  if(customConfig.cache) config.adapter = axiosCache.adapter;
  const networkStatus =  await OfflineHelper.getNetworkStatus();
  if (customConfig.queue && !networkStatus.connected) {
    if (!config.headers) config.headers = { ...axios.defaults.headers.common, ...config.headers };
    emitter.emit("queueTask", {
      callbackEvent: customConfig.callbackEvent,
      payload: config
    });
  } else {
      return axios(config);
  }
}

/**
 * Client method to directly pass configuration to axios
 *
 * @param {any}  config - API configuration
 * @return {Promise} Response from API as returned by Axios
 */
const client = (config: any) => {
  return axios.create().request(config);
}

export { api as default, client, axios };