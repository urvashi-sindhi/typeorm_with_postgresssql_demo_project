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

export enum ServiceType {
  APPROACH = 'Approach',
  CONSULTING = 'Consulting',
  ATC = 'ATC',
  BENEFITS = 'Benefits',
}

export enum ApiTag {
  ADMIN = 'Admin',
  INQUIRY = 'Inquiry',
  Service = 'Service',
}

export enum ConstantValues {
  ADMIN = 'Admin',
}

export enum Token {
  ADMIN_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzE2NDcxMDUsImV4cCI6MTczMTczMzUwNX0.GzmFvRaL0mkhxq61gMqhaznDjMJlnB6zskfyzPq9KPU',
}

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
