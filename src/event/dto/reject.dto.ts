import { IsNotEmpty, IsString } from 'class-validator';

export class RejectEventDto {
  @IsNotEmpty()
  @IsString()
  rejectReason: string;
}
