import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const requestedRole = registerDto.role?.toLowerCase();
    const allowedRoles = ['admin', 'recruiter', 'applicant', 'employee'];

    if (requestedRole && !allowedRoles.includes(requestedRole)) {
      throw new BadRequestException('Role tidak valid');
    }

    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password_hash: hashedPassword,
          full_name: registerDto.fullName,
          role: requestedRole ?? 'applicant',
        },
        select: {
          id: true,
          email: true,
          full_name: true,
          role: true,
          created_at: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email sudah terdaftar');
        }
        throw new BadRequestException('Data registrasi tidak valid');
      }
      throw error;
    }

    return {
      message: 'Registrasi berhasil',
      data: user,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    const { password_hash: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      message: 'Login berhasil',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      },
    };
  }


  async logout(userId: string) {
    return {
      message: 'Logout berhasil',
    };
  }

 async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });
     if (!user) {
      return {
        message: 'Jika email terdaftar, link reset password akan dikirim ke email Anda',
      };
    }

   const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Token berlaku 1 jam
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Simpan token ke database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: hashedToken,
        reset_token_expires: resetTokenExpires,
      },
    });

    console.log('Reset Token:', resetToken); 

    return {
      message: 'Jika email terdaftar, link reset password akan dikirim ke email Anda',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.new_password !== resetPasswordDto.confirm_password) {
      throw new BadRequestException('Password dan konfirmasi password tidak sama');
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordDto.token)
      .digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        reset_token: hashedToken,
        reset_token_expires: {
          gt: new Date(), // Token belum expired
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token tidak valid atau sudah expired');
    }


    const hashedPassword = await bcrypt.hash(resetPasswordDto.new_password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      },
    });

    return {
      message: 'Password berhasil direset',
    };
  }

  
}
