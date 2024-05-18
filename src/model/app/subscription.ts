export type SubscriptionBody = {
  name: string;
  amount: number;
  tag: string;
  status?: SubscriptionStatus;
};

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}