import { CapacitorHttp } from "@capacitor/core";
import BASE_URL from "./config.js";

interface ApiResponse {
  [key: string]: any;
  // Define la estructura de respuesta según tus necesidades
}

interface ApiOptions {
  url: string;
  headers: { [key: string]: string };
  data?: Object;
}

const createApi = (auth: any, router: any) => {
  const get = async (url: string, type?: string): Promise<ApiResponse> => {
    const contentType = type ? type : "application/json";
    const options: ApiOptions = {
      url: BASE_URL + url,
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${auth.token}`,
      },
    };
    try {
      const response = await CapacitorHttp.get(options);
      if (response.status === 403) {
        auth.logout();
        router.replace({ name: "Login" });
      }
      return response;
    } catch (error) {
      if (error.status === 403) {
        auth.logout();
        router.replace({ name: "Login" });
      }
      throw error;
    }
  };

  const post = async (
    url: string,
    data: Object | null,
    type?: string
  ): Promise<ApiResponse> => {
    const contentType = type ? type : "application/json";
    const options: ApiOptions = {
      url: BASE_URL + url,
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${auth.token}`,
      },
      data: data ? { ...data } : {},
    };
    try {
      const response = await CapacitorHttp.post(options);
      if (response.status === 403) {
        auth.logout();
        router.replace({ name: "Login" });
      }
      return response;
    } catch (error) {
      if (error.status === 403) {
        auth.logout();
        router.replace({ name: "Login" });
      }
      throw error;
    }
  };

  return { get, post };
};

export default createApi;
