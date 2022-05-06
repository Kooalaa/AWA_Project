export namespace App {
    export interface Item {
        id: number;
        name: string;
        price: number;
        count: number;
        updateCount: (count: number) => void;
    }
}
