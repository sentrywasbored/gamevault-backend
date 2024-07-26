import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

import { MediaValidator } from "../../../validators/media.validator";
import { DatabaseEntity } from "../../database/database.entity";
import { Media } from "../../media/media.entity";
import { UserDeveloperMetadataDto } from "./user-developer-metadata.dto";
import { UserGenreMetadataDto } from "./user-genre-metadata.dto";
import { UserPublisherMetadataDto } from "./user-publisher-metadata.dto";
import { UserTagMetadataDto } from "./user-tag-metadata.dto";

export class UserGameMetadataDto extends DatabaseEntity {
  @ApiPropertyOptional({
    description: "the minimum age required to play the game",
    example: 18,
    default: 0,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  age_rating?: number = 0;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "title of the game",
    example: "Grand Theft Auto V",
  })
  title?: string;

  @ApiPropertyOptional({
    description: "release date of the game as ISO8601 string",
    example: "2013-09-17T00:00:00.000Z",
  })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  release_date?: string;

  @ApiPropertyOptional({
    description: "description of the game. markdown supported.",
    example:
      "An open world action-adventure video game developed by **Rockstar North** and published by **Rockstar Games**.",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    description:
      "public notes from the admin for the game. markdown supported.",
    example: "# README \n Install other game first!",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;

  @ApiPropertyOptional({
    description: "average playtime of other people in the game in minutes",
    example: 180,
  })
  @IsInt()
  @Min(0)
  @Optional()
  @IsNotEmpty()
  average_playtime?: number;

  @MediaValidator("image")
  @Optional()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: "cover/boxart image of the game",
    type: () => Media,
  })
  cover?: Media;

  @MediaValidator("image")
  @Optional()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: "background image of the game",
    type: () => Media,
  })
  background?: Media;

  @ApiPropertyOptional({
    description: "screenshots of the game",
    type: () => Media,
    isArray: true,
  })
  @Optional()
  @IsNotEmpty()
  @IsArray()
  @MediaValidator("image")
  @ValidateNested({ each: true })
  screenshots?: Media[];

  @ApiPropertyOptional({
    description: "website url of the game",
    example: "https://www.escapefromtarkov.com/",
  })
  @Optional()
  @IsNotEmpty()
  @IsUrl()
  url_website?: string;

  @ApiPropertyOptional({
    description: "rating of the provider",
    example: 90,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  rating?: number;

  @ApiProperty({
    description: "indicates if the game is in early access",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  early_access?: boolean;

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: "publishers of the game",
    type: () => UserPublisherMetadataDto,
    isArray: true,
  })
  publishers?: UserPublisherMetadataDto[];

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: "developers of the game",
    type: () => UserDeveloperMetadataDto,
    isArray: true,
  })
  developers?: UserDeveloperMetadataDto[];

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: "tags of the game",
    type: () => UserTagMetadataDto,
    isArray: true,
  })
  tags?: UserTagMetadataDto[];

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: "genres of the game",
    type: () => UserGenreMetadataDto,
    isArray: true,
  })
  genres?: UserGenreMetadataDto[];
}
