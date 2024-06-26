import { atom, selector, RecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import _ from "lodash";

const { persistAtom } = recoilPersist();

type OrderHistoryItemType = {
  count: number;
  id: string;
  name: string;
  order: number;
  price: number;
  totalPrice: number;
};

type OrderHistoryItemsType = { [key: string]: OrderHistoryItemType } & {
  sumPrice: number;
};

export const orderHistoryStore: RecoilState<OrderHistoryItemsType> = atom({
  key: "orderHistoryStore",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

type BasketItemType = {
  count: number;
  name: string;
  order: number;
  price: number;
  totalPrice: number;
};

type BasketItemsType = { [key: string]: BasketItemType } & {
  sumCount: number;
  sumPrice: number;
};

export const moveBasketToHistory = selector({
  key: "moveBasketToHistory",
  get: () => null,
  set: ({ set, get }, basket: BasketItemsType) => {
    const currentHistory = get(orderHistoryStore);
    const { sumPrice, sumCount, ...basketItems } = basket;

    const historyToBeUpdated = _.cloneDeep(currentHistory);

    Object.entries(basketItems).map(([id, item]) => {
      if (currentHistory && currentHistory[id]) {
        historyToBeUpdated[id] = {
          ...currentHistory[id],
          totalPrice: currentHistory[id].totalPrice + item.totalPrice,
          count: currentHistory[id].count + item.count,
        };
      } else {
        historyToBeUpdated[id] = { id, ...item };
      }
    });

    const newSumPrice: number = (currentHistory.sumPrice || 0) + sumPrice;

    set(orderHistoryStore, {
      ...historyToBeUpdated,
      sumPrice: newSumPrice,
    });
  },
});
