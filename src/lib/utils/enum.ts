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

export enum Token {
  ADMIN_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzE1MDM5OTQsImV4cCI6MTczMTU5MDM5NH0.QkAcHJ13QXYc0D9W4t2FPdor9eR83YflS_1lxrqsEYA',
}

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
