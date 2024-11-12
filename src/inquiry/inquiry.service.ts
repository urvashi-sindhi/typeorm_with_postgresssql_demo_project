import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from 'src/lib/entities/inquiry.entity';
import { handleResponse } from 'src/lib/helpers/handleResponse';
import { ConstantValues, ResponseStatus } from 'src/lib/utils/enum';
import { Messages } from 'src/lib/utils/messages';
import { Repository } from 'typeorm';
import { CreateInquiryDto } from './dto/createInquiry.dto';
import { emailSend } from 'src/lib/helpers/mail';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/lib/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwt: JwtService,
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

  async login(dto: LoginDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!findUser) {
      Logger.error(Messages.CREDENTIALS_NOT_MATCH);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.CREDENTIALS_NOT_MATCH,
      );
    }

    const comparePassword = await bcrypt.compare(
      dto.password,
      findUser.password,
    );

    if (!comparePassword) {
      Logger.error(Messages.CREDENTIALS_NOT_MATCH);
      return handleResponse(
        HttpStatus.UNAUTHORIZED,
        ResponseStatus.ERROR,
        Messages.CREDENTIALS_NOT_MATCH,
        undefined,
      );
    }

    const token = await this.jwt.signAsync({
      id: findUser.id,
      role: ConstantValues.ADMIN,
      email: findUser.email,
    });

    Logger.log(Messages.LOGIN_SUCCESS);
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      Messages.LOGIN_SUCCESS,
      token,
    );
  }

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
