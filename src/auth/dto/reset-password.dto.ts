import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Token tidak boleh kosong' })
  token: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password harus mengandung huruf besar, kecil, dan angka'
  })
  new_password: string;

  @IsString()
  @IsNotEmpty({ message: 'Konfirmasi password tidak boleh kosong' })
  confirm_password: string;
}