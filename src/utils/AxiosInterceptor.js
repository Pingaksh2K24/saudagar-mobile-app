import { APIURL } from '../services/axiosServices/ApiEndPoints';

const axios = require('axios');
// axios.defaults.withCredentials = true;
export const axiosInstance = axios.create({    
    baseURL: APIURL
})
axiosInstance.interceptors.response.use(
    response => successHandler(response),
    error => errorHandler(error)
  )
const isHandlerEnabled = (config={}) => {
    return config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled ? 
      false : true
  }
// await axiosInstance.get('/v2/api-endpoint', { handlerEnabled: false }) --if we want to exclude any api from using interceptor use this
const requestHandler = (request) => {
    if (isHandlerEnabled(request)) {
    }
    return request
}
axiosInstance.interceptors.request.use(
    request => requestHandler(request)
)
const errorHandler = (error) => {
        if (isHandlerEnabled(error.config)) {
            //error page
        }
    return Promise.reject({ ...error })
}

const successHandler = (response) => {
    if (isHandlerEnabled(response.config)) {
        response = response.data;
    }
    return response
}

export const axiosInstanceWithoutEnrypt = axios.create({    
    baseURL: APIURL
})
