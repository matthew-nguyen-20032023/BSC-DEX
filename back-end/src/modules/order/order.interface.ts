export interface IOrderBook {
  buyOrders: { price: string; amount: string }[];
  sellOrders: { price: string; amount: string }[];
}
