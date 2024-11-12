import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from 'src/lib/entities/inquiry.entity';
import { handleResponse } from 'src/lib/helpers/handleResponse';
import { ResponseStatus } from 'src/lib/utils/enum';
import { Messages } from 'src/lib/utils/messages';
import { Repository } from 'typeorm';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  async listOfInquiries() {
    const inquiryList = await this.inquiryRepository.find();

    if (inquiryList.length <= 0) {
      Logger.error(`Inquiry details ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Inquiry details ${Messages.NOT_FOUND}`,
      );
    }

    Logger.log(`Inquiry ${Messages.GET_SUCCESS}`);
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      inquiryList,
    );
  }
}
