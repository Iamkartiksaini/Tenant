import axios from "axios";
import {
  server_base_Url,
  accessTokenKey,
  refreshTokenKey,
  getStoreToken,
  removeCookeyKey,
  cookiesKey,
  getCookies,
  setStoreToken,
} from "@/lib/constants";

const baseURL = server_base_Url;
refreshTokenKey;

const instance = axios.create({
  baseURL,
  timeout: 1000 * 60,
});

instance.interceptors.request.use(
  async function (config) {
    try {
      config.headers["Content-Type"] = "application/json";
      config.headers.Accept = "application/json";
      const token = getStoreToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      throw new Error(error.message);
    }
    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response?.data?.success) {
      return response?.data;
    } else {
      throw new Error(response?.data?.message || "Server Error");
    }
  },
  async function (error) {
    const originalRequest = error.config;

    const { status, response } = error;
    if (status === 401) {
      const refToken = getCookies();
      if (refToken == undefined) {
        removeCookeyKey();
        window.location.pathname = "/";
      } else {
        const { isSuccess } = await refreshLogic(refToken);
        if (isSuccess) {
          return await instance(originalRequest);
        } else {
          removeCookeyKey();
          window.location.pathname = "/";
        }
      }
    }

    const errorMessage =
      response?.data?.message || error?.message || "Something went wrong";
    return {
      data: null,
      success: false,
      message: errorMessage,
    };
  }
);

// Refresh Logic -----------
async function refreshLogic(t) {
  try {
    const { data } = await refreshApi(t);
    if (data?.accessToken) {
      setStoreToken({ token: data?.accessToken });
      return { isSuccess: true };
    } else {
      throw new Error();
    }
  } catch (error) {
    return {
      isSuccess: false,
    };
  }
}
// Refresh Logic -----------

export async function login(body) {
  return await instance.post("auth/login", body);
}

export async function refreshApi(t) {
  return await instance.post("auth/refresh", { refreshToken: t });
}

export async function register(body) {
  return await instance.post("auth/register", body);
}

export async function getExpenses(params) {
  const { page = 1, pageSize = 10, startDate, endDate } = params;

  let paramsData = { page, pageSize };

  if (startDate && endDate) {
    paramsData = { page, pageSize, startDate, endDate };
  }

  return await instance.get("/expenses", {
    params: paramsData,
  });
}

export async function createExpense(body) {
  return await instance.post("/expenses", body);
}

export async function getSummary({ startDate = "", endDate = "" }) {
  return await instance.get("/summary", {
    params: { startDate, endDate },
  });
}
