export enum StaffRole {
    CHEF = 'CHEF',
    BARMAN = 'BARMAN',
    WAITER = 'WAITER',
}

export enum Staff {
    CHEFS = 'CHEFS',
    BARMANS = 'BARMANS',
    WAITERS = 'WAITERS',
}

export interface IStaff {
    readonly username: string,
    readonly role: StaffRole,
}