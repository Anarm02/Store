import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../Models/basket";

interface StoreContext {
  basket: Basket;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}
export const StoreContext = createContext<StoreContext | undefined>(undefined);
export function useStoreContext() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw Error("Oops something wrong in provider");
  }
  return context;
}
export function StoreProvider({ children }: PropsWithChildren<unknown>) {
  const [basket, setBasket] = useState<Basket | null>(null);
  function removeItem(productId: number, quantity: number) {
    if (!basket) return;
    const items = [...basket.items];
    const findIndex = items.findIndex((i) => i.productId === productId);
    if (findIndex >= 0) {
      items[findIndex].quantity -= quantity;
      if (items[findIndex].quantity === 0) items.splice(findIndex, 1);
      setBasket((prevState) => {
        return { ...prevState!, items };
      });
    }
  }
  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}
