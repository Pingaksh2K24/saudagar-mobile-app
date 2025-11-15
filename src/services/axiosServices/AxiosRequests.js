/**
 * This file contain the all the Common API type of requests
 *
 */
import { APIURL } from './ApiEndPoints';
import {
  axiosInstance,
  axiosInstanceWithoutEnrypt,
} from '../../utils/AxiosInterceptor';
import { getAuthProps } from '../../utils/AuthenticationLibrary';
import { fetchToken } from '../../utils/AuthenticationLibrary';

// common post request
export function axiosPost(url, request) {
  return axiosInstance.post(APIURL + url, request);
}

// post request for login without data wrapping
export function axiosPostLogin(url, request) {
  return axiosInstance.post(APIURL + url, request);
}

//** POST Authorize */
export async function axiosPostAuthorize(url, request, isFormData = false) {
  try {
    const token = await fetchToken();
    let tokenString = token._j || token;
    if (tokenString) {
      let headers = {
        Authorization: `Bearer ${tokenString}`,
        'Content-Type': 'application/json',
      };
      return axiosInstance.post(APIURL + url, request, { headers });
    } else {
      throw new Error('No token found');
    }
  } catch (error) {
    console.log('Auth error:', error);
    throw error;
  }
}

export async function axiosGetAuthorize(url, param) {
  try {
    const token = await fetchToken();
    if (token) {
      let headers = { Authorization: `Bearer ${token}` };
      return axiosInstance.get(APIURL + url.replace('{0}', param || ''), {
        headers,
      });
    } else {
      throw new Error('No token found');
    }
  } catch (error) {
    console.log('Auth GET error:', error);
    throw error;
  }
}
// common get request with one parameter
export function axiosGet(url, param) {
  return axiosInstance.get(APIURL + url.replace('{0}', param));
}
// common get request with multiple parameter
export async function axiosGetMultiParams(url, params) {
  try {
    const token = await fetchToken();
    let tokenString = token._j || token;
    if (tokenString) {
      let headers = { Authorization: `Bearer ${tokenString}` };
      const [userId, page] = params;
      url = url.replace('{user_id}', userId).replace(/page=\d+/, `page=${page}`);
      return axiosInstance.get(APIURL + url, { headers });
    } else {
      throw new Error('No token found');
    }
  } catch (error) {
    console.log('Auth GET Multi Params error:', error);
    throw error;
  }
}
// common post request with encryption
export function axiosPostWithoutEncryption(url, request, isFormData) {
  if (isFormData) {
    let headers = {
      // Authorization: `Bearer ${loginUser.token.token}`,
      'content-type': 'multipart/form-data',
    };
    return axiosInstance.post(APIURL + url, request, { headers });
  }
  return axiosInstance.post(APIURL + url, request);
}

export function axiosPostFileAuthorizeblob(url, request, isFormData) {
  let loginUser = getAuthProps();
  if (loginUser) {
    if (true) {
      var data = { data: request };
      // let tokenProp = getTokenProps();
      // let abc = 'Bearer ' + tokenProp.data;
      let headers = { Authorization: `Bearer ${loginUser.token.token}` };

      return axiosInstanceWithoutEnrypt.post(APIURL + url, data, {
        headers,
        responseType: 'blob',
      });
    } else {
      window.location.href = '/';
    }
  } else {
    window.location.href = '/';
  }
}
export function axiosGetFileAuthorizeblob(url, params) {
  let loginUser = getAuthProps();
  if (loginUser) {
    if (true) {
      params.forEach((value, key) => {
        url = url.replace('{' + key + '}', value);
      });
      let headers = { Authorization: `Bearer ${loginUser.token.token}` };
      return axiosInstanceWithoutEnrypt.get(APIURL + url, {
        headers,
        responseType: 'blob',
      });
    } else {
      window.location.href = '/';
    }
  } else {
    window.location.href = '/';
  }
}

export function axiosGetAuthorizeMultiParams(url, params) {
  let loginUser = getAuthProps();
  if (loginUser) {
    if (true) {
      params.forEach((value, key) => {
        url = url.replace('{' + key + '}', value);
      });
      let headers = { Authorization: `Bearer ${loginUser.token.token}` };
      return axiosInstance.get(APIURL + url, { headers });
    } else {
      window.location.href = '/';
    }
  } else {
    window.location.href = '/';
  }
}
export function axiosGetMultiParamsWithOutEncryption(url, params) {
  params.forEach((value, key) => {
    url = url.replace('{' + key + '}', value);
  });
  let headers = { Authorization: '' };
  return axiosInstanceWithoutEnrypt.get(APIURL + url, {
    headers,
    responseType: 'blob',
  });
}
