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
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import * as moment from 'moment';
import { Otp } from 'src/lib/entities/otp.entity';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
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

  async resetPassword(req: any, dto: ResetPasswordDto) {
    const { id } = req.user;

    const findUser = await this.userRepository.findOne({
      where: {
        id,
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

    const validPassword = await bcrypt.compare(
      dto.oldPassword,
      findUser.password,
    );

    if (!validPassword) {
      Logger.error(Messages.CREDENTIALS_NOT_MATCH);
      return handleResponse(
        HttpStatus.UNAUTHORIZED,
        ResponseStatus.ERROR,
        Messages.CREDENTIALS_NOT_MATCH,
      );
    }

    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(dto.newPassword, saltOrRounds);

    const updatePassword = await this.userRepository.update(
      { id },
      {
        password: hashPassword,
      },
    );

    if (updatePassword.affected > 0) {
      Logger.log(`Password is ${Messages.UPDATE_SUCCESS}`);
      return handleResponse(
        HttpStatus.OK,
        ResponseStatus.SUCCESS,
        `Password is ${Messages.UPDATE_SUCCESS}`,
      );
    }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!findUser) {
      Logger.error(Messages.EMAIL_VALIDATION);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.EMAIL_VALIDATION,
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expirationTime = moment().add(1, 'minutes').format();

    const sendOtp = {
      email: findUser.email,
      otp: otp,
    };

    emailSend(sendOtp);

    const otpData = await this.otpRepository.save({
      otp,
      email: findUser.email,
      expiration_time: expirationTime,
    });

    if (otpData) {
      Logger.log(Messages.OTP_SENT);
      return handleResponse(
        HttpStatus.OK,
        ResponseStatus.SUCCESS,
        Messages.OTP_SENT,
        otpData.otp,
      );
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email, otp, newPassword } = dto;

    const findOtp = await this.otpRepository.findOne({
      where: { otp },
    });

    if (!findOtp) {
      Logger.error(Messages.OTP_VALIDATION);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.OTP_VALIDATION,
      );
    }

    const findEmail = await this.otpRepository.findOne({
      where: { email },
    });

    if (!findEmail) {
      Logger.error(`Email ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Email ${Messages.NOT_FOUND}`,
      );
    }

    const expireTime = findOtp.expiration_time;
    const currentTime = moment().format();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    if (currentTime >= expireTime) {
      Logger.error(Messages.OTP_EXPIRED);
      return handleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseStatus.ERROR,
        Messages.OTP_EXPIRED,
      );
    }

    const removeOtp = await this.otpRepository.delete({
      otp,
      email,
    });

    if (removeOtp.affected > 0) {
      const updatePassword = await this.userRepository.update(
        { email },
        {
          password: hashedPassword,
        },
      );

      if (updatePassword.affected > 0) {
        Logger.log(`Password ${Messages.UPDATE_SUCCESS}`);
        return handleResponse(
          HttpStatus.ACCEPTED,
          ResponseStatus.SUCCESS,
          `Password ${Messages.UPDATE_SUCCESS}`,
        );
      }
    }
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
