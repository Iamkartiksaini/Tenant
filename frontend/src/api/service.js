import axios from "axios";
import { server_base_Url, cookiesKey } from "@/lib/constants";

import Cookies from "universal-cookie";

const baseURL = server_base_Url;
const cookieDataKey = cookiesKey;

const instance = axios.create({
  baseURL,
  timeout: 1000 * 60,
});

instance.interceptors.request.use(
  async function (config) {
    try {
      config.headers["Content-Type"] = "application/json";
      config.headers.Accept = "application/json";
      const token = new Cookies().get(cookieDataKey);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      throw new Error(error.message);
    }
    return config;
  },

  function (error) {
    debugger;
    console.log(error);
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
  function (error) {
    const { status, response } = error;
    if (status === 401) {
      const cookies = new Cookies();
      cookies.remove(cookieDataKey, { path: "/" });
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

export async function login(body) {
  return await instance.post("auth/login", body);
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
