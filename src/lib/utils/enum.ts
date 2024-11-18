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
  ADMIN_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzE2NjI0MzQsImV4cCI6MTczMTc0ODgzNH0.TUt156wrYxHDQwwbURdNT0hyD39V0LJ47QGxfbVPGAk',
  WRONG_TOKEN = 'Bearer eyhtJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzE2NjI0MzQsImV4cCI6MTczMTc0ODgzNH0.TUt156wrYxHDQwwbURdNT0hyD39V0LJ47QGxfbVPGAk',
  EXPIRE_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk4NDA3MDQsImV4cCI6MTcyOTkyNzEwNH0.dwVrl5WHaIZqD0aewS-LcESDCet6UCYPtxBSqb_UNoM',
}

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
