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
  ADMIN_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzE5MDc0MjYsImV4cCI6MTczMTk5MzgyNn0.KcYJg6bSe9EhLnIr84EqOVJzu3TpuQdlcIN9mmennls',
}

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
