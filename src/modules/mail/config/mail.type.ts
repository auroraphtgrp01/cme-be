
export enum EMailType {
  VERIFY_EMAIL = 'verify-email',
  ORDER_SUCCESS = 'order-success'
}

export interface IMailSenderPayload {
  types: EMailType;
  emailReceiver: string;
  nameOfReceiver?: string;
  lang?: string;
  token?: string;
}

export interface IEmailVerifyPayload extends IMailSenderPayload {
  registration_date?: string
  verification_url?: string
}

export interface IOrderSuccessPayload extends IMailSenderPayload {
  order_id?: string
  order_date?: string
  phone?: string
  payment_method?: string
  courseLink?: string
}