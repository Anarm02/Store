export interface Basket {
  id: number;
  buyerId: string;
  items: BasketItem[];
}

export interface BasketItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  type: string;
  brand: string;
}
