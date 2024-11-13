export enum SwaggerConfig {
  TITLE = 'Cuentista Tech',
}

export enum ResponseStatus {
  SUCCESS = 'Success',
  ERROR = 'Error',
}

export enum InquiryStatus {
  PENDING = 'Pending',
  RESOLVE = 'Resolve',
}

export enum ApiTag {
  ADMIN = 'Admin',
  INQUIRY = 'Inquiry',
}

export enum ConstantValues {
  ADMIN = 'Admin',
}

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
