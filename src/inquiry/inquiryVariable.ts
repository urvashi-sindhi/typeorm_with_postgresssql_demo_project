import { InquiryStatus } from '../lib/utils/enum';

export const inquiry = {
  createInquiry: {
    first_name: 'test',
    last_name: 'Sindhi',
    email: 'test103@gmail.com',
    message: 'Please provide messages.',
    phone_number: '+91-9988772211',
    status: 'Pending',
  },

  checkValidationType: {
    first_name: 990,
    last_name: 'Sindhi',
    email: 'test6@gmail.com',
    message: 'Please provide messages.',
    phone_number: '+91-9988772211',
    status: 'Pending',
  },

  requiredValidation: {
    first_name: 'testt',
    email: 'test6@gmail.com',
    message: 'Please provide messages.',
    phone_number: '+91-9988772211',
    status: 'Pending',
  },

  checkEmailValidationFormat: {
    first_name: 'testtt',
    last_name: 'Sindhi',
    email: 'test1gmail.com',
    message: 'Please provide messages.',
    phone_number: '+91-9988772211',
    status: 'Pending',
  },

  alreadyRegister: {
    first_name: 'Saloni',
    last_name: 'Sindhi',
    email: 'saloni10@gmail.com',
    message: 'Please provide messages.',
    phone_number: '+91-9988772211',
    status: 'Pending',
  },

  changeStatus: {
    status: InquiryStatus.RESOLVE,
  },

  pagination: {
    sortValue: 'ASC',
    sortKey: 'id',
    pageSize: 10,
    page: 1,
    searchBar: 'Saloni',
  },

  wrongPagination: {
    sortValue: 'ASC',
    sortKey: 'id',
    pageSize: 10,
    page: 1,
    searchBar: 'dsa',
  },
};
