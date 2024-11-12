import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from 'src/lib/entities/inquiry.entity';
import { handleResponse } from 'src/lib/helpers/handleResponse';
import { ResponseStatus } from 'src/lib/utils/enum';
import { Messages } from 'src/lib/utils/messages';
import { Repository } from 'typeorm';
import { emailSend } from 'src/lib/helpers/mail';
import { CreateInquiryDto } from './dto/createInquiry.dto';

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
}
