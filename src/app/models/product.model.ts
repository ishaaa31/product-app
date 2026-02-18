export interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productCategory: string;
}

export interface ProductDetails {
  productDescription?: string;
  isExpire: boolean;
  dateTime?: string;
  manufacturer: string;
  weight?: string;
  warrantyInMonths: number;
}

export interface CreateProductRequest {
  productName: string;
  productPrice: number;
  productCategory: string;
  productDescription?: string;
  isExpire: boolean;
  dateTime?: string;
  manufacturer: string;
  weight?: string;
  warrantyInMonths: number;
}

export interface ProductResponse {
  productId: number;
  productName: string;
  productPrice: number;
  productCategory: string;
  productDescription?: string;
  isExpire: boolean;
  dateTime?: string;
  manufacturer: string;
  weight?: string;
  warrantyInMonths: number;
}

export interface ProductListResponse {
  productId: number;
  productName: string;
  productPrice: number;
  productCategory: string;
  hasDetails: boolean;
}