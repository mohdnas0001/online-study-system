import { AppToast } from "@/_hook/toast";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  isAxiosError,
} from "axios";
import Cookies from "js-cookie";



export const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const testMode = process.env.NEXT_PUBLIC_TEST == "true";

export const getCurrentUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
};

export interface ErrorRes {
  status: boolean;
  message: string;
  data: string;
}



export const handleError = <T>(error: unknown, message?: string, makeToast = true) => {
  const { error: errorToast } = AppToast;

  if (isAxiosError<T>(error)) {
    const msg = (error?.response?.data as { message: string })?.message ?? error?.message;
    if (makeToast) errorToast({ title: 'Error', message: msg });
    return msg;
  }
  if (typeof error === "string") {
    if (makeToast) errorToast({ title: 'Error', message: error });
    return error;
  }
  if (typeof (error as Error)?.message === "string") {
    const msg = (error as Error)?.message;
    if (makeToast) errorToast({ title: (error as Error)?.name, message: msg });
    return msg;
  }
  if (axios.isCancel(error)) {
    const msg = 'Request cancelled';
    if (makeToast) errorToast({ title: 'Cancelled', message: msg });
    return msg;
  }

  const msg = message ?? "Error when proccessing...";
  if (makeToast) errorToast({ title: 'Error', message: msg });
  return msg;
};

export const headers = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
});

const instance = axios.create({
  baseURL: baseUrl,
});

type HTTPRequestConfig = AxiosRequestConfig & {
  signal?: AbortSignal
};

const api = (axios: AxiosInstance) => {
  return {
    get: <T>(
      url: string,
      config: HTTPRequestConfig = { headers: headers() },
    ) => {
      return axios.get<T>(url, config);
    },
    delete: <T>(
      url: string,
      config: HTTPRequestConfig = { headers: headers() },
    ) => {
      return axios.delete<T>(url, config);
    },
    put: <T>(
      url: string,
      body: unknown,
      config: HTTPRequestConfig = { headers: headers() },
    ) => {
      return axios.put<T>(url, body, config);
    },
    patch: <T>(
      url: string,
      body: unknown,
      config: HTTPRequestConfig = { headers: headers() },
    ) => {
      return axios.patch<T>(url, body, config);
    },
    post: <T>(
      url: string,
      body: unknown,
      config: HTTPRequestConfig = { headers: headers() },
    ) => {
      return axios.post<T>(url, body, config);
    },
    createCancelToken: () => {
      const controller = new AbortController();
      return {
        signal: controller.signal,
        cancel: () => controller.abort()
      };
    }
  };
};

export const Http = api(instance);
