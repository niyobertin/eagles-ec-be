export interface IUser {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum SUBJECTS {
  REQUEST_2FA = "Request for 2FA",
  CONFIRM_2FA = "Confirm 2-Factor Authentication",
  DISABLE_2FA = "Disable 2-Factor Authentication",
  CONFIRM_OTP = "Verify that It's you",
}

export enum STATUS {
  PENDING = "Pending",
  SUCCESS = "Success",
  FAILED = "Failed",
}
