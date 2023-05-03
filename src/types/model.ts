export interface Expense {
    id: number;
    price: number;
    date: Date;
    comment: string;
    expense: boolean;
    accountId: number;
}

export interface Account {
    id: number;
    currency: string;
    name: string;
    balance: number;
}