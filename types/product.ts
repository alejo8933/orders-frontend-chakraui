export interface Supplier {
  id: number;
  companyName: string;
}

export interface Product {
  id: number;
  productName: string;
  supplierId: number;
  unitPrice: number;
  package: string;
  isDiscontinued: boolean;
  supplier?: Supplier;
}
