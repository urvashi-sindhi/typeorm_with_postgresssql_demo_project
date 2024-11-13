import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { Messages } from 'src/lib/utils/messages';
import { handleResponse } from 'src/lib/helpers/handleResponse';
import { ConstantValues, ResponseStatus } from 'src/lib/utils/enum';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import * as moment from 'moment';
import { Otp } from 'src/lib/entities/otp.entity';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { emailSend } from 'src/lib/helpers/mail';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private jwt: JwtService,
  ) {}

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
        HttpStatus.BAD_REQUEST,
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
      Logger.error(Messages.EMAIL_VALIDATION);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.EMAIL_VALIDATION,
      );
    }

    const validPassword = await bcrypt.compare(
      dto.oldPassword,
      findUser.password,
    );

    if (!validPassword) {
      Logger.error(Messages.CREDENTIALS_NOT_MATCH);
      return handleResponse(
        HttpStatus.BAD_REQUEST,
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
      Logger.error(Messages.EMAIL_VALIDATION);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.EMAIL_VALIDATION,
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
}
