import { Category, Product, Productunit } from "@/types/Product";
import httpClient from "@/utils/httpClient";

// ***************** Product ******************
export const getProduct = async (): Promise<Product[]> => {
  const response = await httpClient.get(`/product`);
  return response.data;
};

export const getProductById = async (id: number): Promise<Product[]> => {
  const response = await httpClient.get(`/product/${id}`);
  return response.data;
};

export const getProductCount = async (): Promise<any> => {
  const response = await httpClient.get(`/product/count`);
  return response.data;
};

export const getProductCode = async (code: string): Promise<any> => {
  const response = await httpClient.get(`/product/code/${code}`);
  return response.data;
};

export const getProductPage = async (
  page: number,
  limit: number,
  columnname: string,
  sort: string
): Promise<Product[]> => {
  const response = await httpClient.get(
    `product/pages?page=${page}&limit=${limit}&columnname=${columnname}&sort=${sort}`
  );
  return response.data;
};

export const getProductSearch = async (
  search: string,
  searchSelect: string
): Promise<any> => {
  const response = await httpClient.get(
    `product/search/${search}?searchSelect=${searchSelect}`
  );
  return response.data;
};

export const putProduct = async (
  product: Product,
  id: number
): Promise<Product> => {
  const response = await httpClient.put(`product/${id}`, product, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const saveProduct = async (product: Product): Promise<Product> => {
  const response = await httpClient.post(`product`, product, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<any> => {
  const response = await httpClient.delete(`/product/${id}`);
  return response.data;
}

// *****************************************

// ***************** Sale ******************
export const postSale = async (cart: object, invoice: object): Promise<any> => {
  const response = await httpClient.post(
    `sale`,
    { cart, invoice },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};
// *****************************************

// ***************** Invoice ***************
export const getInvoiceLatest = async (): Promise<any> => {
  const response = await httpClient.get(`/invoice/latest`);
  return response.data;
};
export const getInvoiceCountDateSum = async (): Promise<any> => {
  const response = await httpClient.get(`/invoice/countdate`);
  return response.data;
};
// *****************************************

// ***************** Category **************
export const getCategory = async (): Promise<Category[]> => {
  const response = await httpClient.get(`/category`);
  return response.data;
};

// *****************************************

// ***************** Productunit **************
export const getProductunit = async (): Promise<Productunit[]> => {
  const response = await httpClient.get(`/productunit`);
  return response.data;
};

// *****************************************