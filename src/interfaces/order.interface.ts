export interface IOrder {
    readonly orderId: string,
    readonly tableId: string,
    readonly foods: [],
    readonly drinks: [],
    drinkPrepared: boolean,
    foodPrepared: boolean,
    drinkServed: boolean,
    foodServed: boolean,
    paid: boolean,
    total: Number,
}