import { InquiryStatus } from '../lib/utils/enum';

export const inquiry = {
  createInquiry: {
    first_name: 'Saloni',
    last_name: 'Sindhi',
    email: 'saloni10@gmail.com',
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
    searchBar: 'xyz',
  },
};
