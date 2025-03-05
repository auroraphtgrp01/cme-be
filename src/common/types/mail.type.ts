import { IUserFromToken } from '@/modules/users/user.i';

export enum EMailType {
  VERIFY_EMAIL = 'verify-email',
  FORGOT_PASSWORD = 'forgot-password',
  INVITE_PARTICIPANT = 'invite-participant',
}

export interface IMailSenderPayload {
  types: EMailType;
  emailReceiver: string;
  nameOfReceiver?: string;
  lang?: string;
  token?: string;
}

export interface IMailJoinToExpentitureFund extends IMailSenderPayload {
  operator?: IUserFromToken;
  fundName: string;
  fundId: string;
  receiverId: string;
}
