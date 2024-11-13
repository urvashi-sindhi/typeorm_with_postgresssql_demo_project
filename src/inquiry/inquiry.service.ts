import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from 'src/lib/entities/inquiry.entity';
import { handleResponse } from 'src/lib/helpers/handleResponse';
import { InquiryStatus, ResponseStatus } from 'src/lib/utils/enum';
import { Messages } from 'src/lib/utils/messages';
import { Like, Repository } from 'typeorm';
import { emailSend } from 'src/lib/helpers/mail';
import { CreateInquiryDto } from './dto/createInquiry.dto';
import { paginate } from 'src/lib/helpers/paginationService';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  async createInquiry(dto: CreateInquiryDto) {
    const findInquiry = await this.inquiryRepository.findOne({
      where: { email: dto.email },
    });

    if (findInquiry) {
      Logger.error(`Inquiry ${Messages.ALREADY_EXIST}`);
      return handleResponse(
        HttpStatus.CONFLICT,
        ResponseStatus.ERROR,
        `Inquiry ${Messages.ALREADY_EXIST}`,
      );
    }

    const createInquiry = await this.inquiryRepository.save({ ...dto });

    if (createInquiry) {
      await emailSend(createInquiry);
      Logger.log(`Inquiry ${Messages.ADDED_SUCCESS}`);
      return handleResponse(
        HttpStatus.CREATED,
        ResponseStatus.SUCCESS,
        `Inquiry ${Messages.ADDED_SUCCESS}`,
        { id: createInquiry.id },
      );
    }
  }

  async viewInquiry(inquiryId: number) {
    const inquiryDetails = await this.inquiryRepository.findOne({
      where: { id: inquiryId },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'message',
        'phone_number',
        'status',
      ],
    });

    if (!inquiryDetails) {
      Logger.error(`Inquiry ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    }

    Logger.log(`Inquiry ${Messages.GET_SUCCESS}`);
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      inquiryDetails,
    );
  }

  async updateInquiryStatus(inquiryId: number) {
    const findInquiry = await this.inquiryRepository.findOne({
      where: { id: inquiryId, status: InquiryStatus.PENDING },
    });

    if (!findInquiry) {
      Logger.error(`Inquiry ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    }

    const inquiryStatus = await this.inquiryRepository.update(
      { id: inquiryId, status: InquiryStatus.PENDING },
      {
        status: InquiryStatus.RESOLVE,
      },
    );

    if (inquiryStatus.affected > 0) {
      Logger.log(`Inquiry status ${Messages.UPDATE_SUCCESS}`);
      return handleResponse(
        HttpStatus.ACCEPTED,
        ResponseStatus.SUCCESS,
        `Inquiry status ${Messages.UPDATE_SUCCESS}`,
      );
    }
  }

  async listOfInquiries(inquiryInfo: any) {
    let whereCondition = {};

    if (inquiryInfo.searchBar) {
      whereCondition = [
        { first_name: Like(`%${inquiryInfo.searchBar}%`) },
        { last_name: Like(`%${inquiryInfo.searchBar}%`) },
        { email: Like(`%${inquiryInfo.searchBar}%`) },
        { message: Like(`%${inquiryInfo.searchBar}%`) },
      ];
    }

    const paginatedData = await paginate(inquiryInfo, this.inquiryRepository);

    const listOfInquiries = await this.inquiryRepository.find({
      where: whereCondition,
      order: {
        [inquiryInfo.sortKey || 'id']: [inquiryInfo.sortValue || 'ASC'],
      },
      take: paginatedData.pageSize,
      skip: paginatedData.skip,
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'message',
        'phone_number',
        'status',
      ],
    });

    if (listOfInquiries.length <= 0) {
      Logger.error(`Inquiry ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    }

    Logger.log(`Inquiry ${Messages.GET_SUCCESS}`);
    return handleResponse(HttpStatus.OK, ResponseStatus.SUCCESS, undefined, {
      listOfInquiries,
      totalPages: paginatedData?.totalPages,
      totalRecordsCount: paginatedData?.totalRecordsCount,
      currentPage: paginatedData?.currentPage,
      numberOfRows: listOfInquiries.length,
      limit: paginatedData?.limit,
    });
  }
}
