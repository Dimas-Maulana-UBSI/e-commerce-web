import { AxiosError } from "axios";
import { ApiResponse } from "@/types/Api.type";
import { Product, ProductListResponse } from "@/types/Product";
import { SortType } from "@/types/Sort.type";
import { ShopProductsResponse } from "@/types/Shop.type";
import apiClient from "./apiClient.service";

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  categoryId?: number,
  minPrice?: number | null,
  maxPrice?: number | null,
  sort: SortType = "newest",
  order: "asc" | "desc" = "desc"
): Promise<ProductListResponse> {
  try {
    const params: Record<string, string | number|undefined> = { page, limit, sort, order };
    if (categoryId) params.categoryId = categoryId;
    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;

    const { data } = await apiClient.get<ApiResponse<ProductListResponse>>("/products", {
      params,
    });


    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response?.data as { message?: string })?.message ||
          "Failed to fetch products"
      );
    }
    throw error;
  }
}


export async function getProductById(id: number): Promise<Product> {
  try {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response?.data as { message?: string })?.message ||
          "Failed to fetch product"
      );
    }
    throw error;
  }
}

export async function getShopProductBySlug(
    page: number = 1,
    limit: number = 10,
    slug: string
): Promise<ShopProductsResponse> {
  try {
    
    const params: Record<string, string | number> = { page, limit };
    const { data } = await apiClient.get<ApiResponse<ShopProductsResponse>>(`/stores/slug/${slug}`, {
      params,
    });
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response?.data as { message?: string })?.message ||
          "Failed to fetch product"
      );
    }
    throw error;
  }
}


// Get Seller Products
export async function getSellerProducts(
  page: number = 1,
  limit: number = 10,
  isActive?: boolean,
  q?:string,
): Promise<ProductListResponse> {
  try {
    
    const params: Record<string, string | number| boolean> = { page, limit };
    if(isActive) params.isActive = isActive;
    if(q) params.q = q;

    const { data } = await apiClient.get<ApiResponse<ProductListResponse>>(`/seller/products`, {
      params,
    });
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response?.data as { message?: string })?.message ||
          "Failed to fetch products seller"
      );
    }
    throw error;
  }
}

  // Post Seller Products
  export async function postSellerProducts(formData: FormData): Promise<Product> {
  try {
    const { data } = await apiClient.post<ApiResponse<Product>>(
      "/seller/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ Ensure proper content type
        },
      }
    );

    return data.data;
  } catch (error: unknown) {
    
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response?.data as { message?: string })?.message ||
          "Product add failed"
      );
    }
    throw error;
  }
}
