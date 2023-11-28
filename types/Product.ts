// export interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
//   rating: Rating;
// }

// export interface Rating {
//   rate: number;
//   count: number;
// }

export interface Product {
  id?: number;
  Product_Name: string;
  Product_Code: string;
  Product_Stock: number;
  Product_Price: number;
  Product_Status: number;
  Product_Description: string;
  Product_Image: any;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  productunitId: number;
  category: Category;
  productunit: Productunit;
  quantityCart?: number;
  PreviewImage?: string;
}

export interface Cart {
  Sales_Quantity: number;
  Sales_Unit_Price: number;
  Sales_Sub_Total: number;
  productId: number;
  invoiceId?: number;
  customerId: any;
  userId: number;
}

export interface Invoice {
  Invoice_Amount_Tendered: any;
  Invoice_Bank_Account_Name: string;
  Invoice_Bank_Account_Number: string;
  Invoice_Payment_Type: number;
  customerId: number;
}

export interface Category {
  id: number;
  Category_Name: string;
}

export interface Productunit {
  id: number;
  Productunit_Name: string;
}
