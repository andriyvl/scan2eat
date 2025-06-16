import { OrderStatus, DishStatus } from '../types/types';

export interface StatusColors {
  bg: string;
  text: string;
  icon: string;
  border: string;
  textSecondary: string;
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, StatusColors> = {
  [OrderStatus.Pending]: {
    bg: 'var(--order-status-pending-bg)',
    border: 'var(--order-status-pending-border)',
    icon: 'var(--order-status-pending-icon)',
    text: 'var(--order-status-pending-text)',
    textSecondary: 'var(--order-status-pending-text-secondary)',
  },
  [OrderStatus.InProgress]: {
    bg: 'var(--order-status-in-progress-bg)',
    border: 'var(--order-status-in-progress-border)',
    icon: 'var(--order-status-in-progress-icon)',
    text: 'var(--order-status-in-progress-text)',
    textSecondary: 'var(--order-status-in-progress-text-secondary)',
  },
  [OrderStatus.Delivered]: {
    bg: 'var(--order-status-delivered-bg)',
    border: 'var(--order-status-delivered-border)',
    icon: 'var(--order-status-delivered-icon)',
    text: 'var(--order-status-delivered-text)',
    textSecondary: 'var(--order-status-delivered-text-secondary)',
  },
  [OrderStatus.RequiresAttention]: {
    bg: 'var(--order-status-requires-attention-bg)',
    border: 'var(--order-status-requires-attention-border)',
    icon: 'var(--order-status-requires-attention-icon)',
    text: 'var(--order-status-requires-attention-text)',
    textSecondary: 'var(--order-status-requires-attention-text-secondary)',
  },
  [OrderStatus.AwaitingPayment]: {
    bg: 'var(--order-status-awaiting-payment-bg)',
    border: 'var(--order-status-awaiting-payment-border)',
    icon: 'var(--order-status-awaiting-payment-icon)',
    text: 'var(--order-status-awaiting-payment-text)',
    textSecondary: 'var(--order-status-awaiting-payment-text-secondary)',
  },
  [OrderStatus.Paid]: {
    bg: 'var(--order-status-paid-bg)',
    border: 'var(--order-status-paid-border)',
    icon: 'var(--order-status-paid-icon)',
    text: 'var(--order-status-paid-text)',
    textSecondary: 'var(--order-status-paid-text-secondary)',
  },
};

export const DISH_STATUS_COLORS: Record<DishStatus, StatusColors> = {
  [DishStatus.Awaiting]: {
    bg: 'var(--dish-status-awaiting-bg)',
    border: 'var(--dish-status-awaiting-border)',
    icon: 'var(--dish-status-awaiting-icon)',
    text: 'var(--dish-status-awaiting-text)',
    textSecondary: 'var(--dish-status-awaiting-text-secondary)',
  },
  [DishStatus.Preparing]: {
    bg: 'var(--dish-status-preparing-bg)',
    border: 'var(--dish-status-preparing-border)',
    icon: 'var(--dish-status-preparing-icon)',
    text: 'var(--dish-status-preparing-text)',
    textSecondary: 'var(--dish-status-preparing-text-secondary)',
  },
  [DishStatus.Ready]: {
    bg: 'var(--dish-status-ready-bg)',
    border: 'var(--dish-status-ready-border)',
    icon: 'var(--dish-status-ready-icon)',
    text: 'var(--dish-status-ready-text)',
    textSecondary: 'var(--dish-status-ready-text-secondary)',
  },
  [DishStatus.DishDelivered]: {
    bg: 'var(--dish-status-dish-delivered-bg)',
    border: 'var(--dish-status-dish-delivered-border)',
    icon: 'var(--dish-status-dish-delivered-icon)',
    text: 'var(--dish-status-dish-delivered-text)',
    textSecondary: 'var(--dish-status-dish-delivered-text-secondary)',
  },
};

export function getOrderStatusColors(status: OrderStatus): StatusColors {
  return ORDER_STATUS_COLORS[status];
}

export function getDishStatusColors(status: DishStatus): StatusColors {
  return DISH_STATUS_COLORS[status];
}

// Legacy exports - keeping for backward compatibility
export const ORDER_STATUS_COLOR_VAR: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'var(--order-status-pending)',
  [OrderStatus.InProgress]: 'var(--order-status-in-progress)',
  [OrderStatus.Delivered]: 'var(--order-status-delivered)',
  [OrderStatus.RequiresAttention]: 'var(--order-status-requires-attention)',
  [OrderStatus.AwaitingPayment]: 'var(--order-status-awaiting-payment)',
  [OrderStatus.Paid]: 'var(--order-status-paid)',
};

export const DISH_STATUS_COLOR_VAR: Record<DishStatus, string> = {
  [DishStatus.Awaiting]: 'var(--dish-status-awaiting)',
  [DishStatus.Preparing]: 'var(--dish-status-preparing)',
  [DishStatus.Ready]: 'var(--dish-status-ready)',
  [DishStatus.DishDelivered]: 'var(--dish-status-dish-delivered)',
};

// Legacy functions - keeping for backward compatibility
export function getOrderStatusColorVar(status: OrderStatus): string {
  return ORDER_STATUS_COLOR_VAR[status];
}

export function getDishStatusColorVar(status: DishStatus): string {
  return DISH_STATUS_COLOR_VAR[status];
} 