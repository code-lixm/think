import { IsOptional, IsString } from 'class-validator';

export class ShareDocumentDto {
  @IsString({ message: '文档分享密码类型错误' })
  @IsOptional()
  sharePassword: string;
}
