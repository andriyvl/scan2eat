import type { Addon } from "@/features/menu/types/menu.types";

export type OrderDish = {
    dishId: string;
    name: string;
    basePrice: number;
    price: number;
    addons: Addon[];
    comment?: string;
    takeaway: boolean;
    status: 'pending' | 'in_progress' | 'ready' | 'delivered';
};