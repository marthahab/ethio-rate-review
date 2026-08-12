import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  website?: string;

 @IsOptional()
  @IsString()
  googleMapsUrl?: string;
  
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}