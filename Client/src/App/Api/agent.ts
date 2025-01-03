import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));
axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErros: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErros.push(data.errors[key]);
            }
          }
          throw modelStateErros.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      case 404:
        toast.error(data.title);
        break;
      default:
        break;
    }
    console.log("Caught by interceptor");
    return Promise.reject(error.response);
  }
);
const responseBody = (response: AxiosResponse) => response.data;
const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};
const Catalog = {
  list: () => requests.get("products"),
  details: (id: number) => requests.get(`products/${id}`),
};
const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number, quantity = 1) =>
    requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) =>
    requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};
const TestErrors = {
  get400error: () => requests.get("buggy/bad-request"),
  get401error: () => requests.get("buggy/unauthorized"),
  get404error: () => requests.get("buggy/not-found"),
  getValidationError: () => requests.get("buggy/validation-error"),
  get500error: () => requests.get("buggy/server-error"),
};
const agent = {
  Catalog,
  TestErrors,
  Basket,
};
export default agent;
