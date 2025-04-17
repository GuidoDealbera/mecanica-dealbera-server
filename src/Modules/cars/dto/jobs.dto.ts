import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';
import { JobStatus } from 'src/utils';

export class JobsDto {
  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  isThirdParty: boolean;

  @ApiProperty({enum: JobStatus})
  @IsEnum(JobStatus)
  status: JobStatus

}


export class UpdateJobDto {
  @ApiPropertyOptional({enum: JobStatus})
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  price?: number
}
