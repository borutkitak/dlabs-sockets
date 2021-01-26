import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IOrder } from './interfaces/order.interface';
import { IStaff, Staff, StaffRole } from './interfaces/staff.interface';

@WebSocketGateway()
export class OrderGateway {

    private orders: IOrder[] = []

    @SubscribeMessage('staffLogin')
    staffLogin(client: any, payload: IStaff) {
        const staff = payload;
        switch (staff.role) {
            case StaffRole.CHEF:
                client.join(Staff.CHEFS);
            case StaffRole.BARMAN:
                client.join(Staff.BARMANS);
            case StaffRole.WAITER:
                client.join(Staff.WAITERS);
            default: break;
        }
    }

    @SubscribeMessage('sendOrder')
    sendOrder(client: any, payload: IOrder) {
        this.orders.push(payload);
        client.join(payload.orderId);
        client.to(Staff.BARMANS).emit('receiveOrder', payload)
    }

    @SubscribeMessage('prepareDrink')
    prepareDrink(client: any, payload: string) {
        const order = this.orders.find(o => o.orderId === payload);
        order.drinkPrepared = true;
        client.to(Staff.WAITERS).emit('serveDrinks', order);
        this.orderStatus(client, order);
    }

    @SubscribeMessage('drinkServed')
    drinkServed(client: any, payload: string) {
        const order = this.orders.find(o => o.orderId === payload);
        order.drinkServed = true;
        client.to(Staff.CHEFS).emit('prepareFood', order);
        this.orderStatus(client, order);
    }

    @SubscribeMessage('foodPrepared')
    prepareFood(client: any, payload: string) {
        const order = this.orders.find(o => o.orderId === payload);
        order.foodPrepared = true;
        client.to(Staff.WAITERS).emit('serveFood', payload);
        this.orderStatus(client, order);
    }

    @SubscribeMessage('foodServed')
    foodServed(client: any, payload: string) {
        const order = this.orders.find(o => o.orderId === payload);
        order.foodServed = true;
        this.orderStatus(client, order);
    }

    @SubscribeMessage('payOrder')
    payOrder(client: any, payload: string): boolean {
        const order = this.orders.find(o => o.orderId === payload);
        order.paid = true;
        this.orderStatus(client, order);
        return true;
    }

    orderStatus(client, order) {
        client.to(order.orderId).to(Staff.BARMANS).to(Staff.WAITERS).to(Staff.CHEFS).emit('orderStatus', order);
    }
}
