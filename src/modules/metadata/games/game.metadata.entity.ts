import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";

import { DatabaseEntity } from "../../database/database.entity";
import { GamevaultGame } from "../../games/game.entity";
import { Media } from "../../media/media.entity";
import { DeveloperMetadata } from "../developers/developer.metadata.entity";
import { GenreMetadata } from "../genres/genre.metadata.entity";
import { PublisherMetadata } from "../publishers/publisher.metadata.entity";
import { TagMetadata } from "../tags/tag.metadata.entity";

@Entity()
@Index("UQ_GAME_METADATA", ["provider", "provider_data_id"], {
  unique: true,
})
export class GameMetadata extends DatabaseEntity {
  @ManyToOne(() => GamevaultGame, (game) => game.metadata)
  @ApiPropertyOptional({
    description: "game the metadata belongs to",
    type: () => GamevaultGame,
    isArray: true,
  })
  gamevault_game?: GamevaultGame;

  @Column()
  @Index()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "Invalid provider_slug: Only lowercase letters, numbers, and single hyphens inbetween them are allowed.",
  })
  @ApiProperty({
    description: "provider slug of the metadata",
  })
  provider_slug: string;

  @Column({ nullable: true })
  @Index()
  @ApiPropertyOptional({
    description: "id of the game from the provider",
    example: "Grand Theft Auto V",
  })
  provider_data_id?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "Probability of the metadata being the correct one.",
    example: 0.5,
    minimum: 0,
    maximum: 1,
  })
  provider_probability?: number;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "checksum of the provider data",
    example: "3608a6d1a05aba23ea390e5f3b48203dbb7241f7",
  })
  provider_checksum?: string;

  @Column({ nullable: true, type: "integer" })
  @ApiPropertyOptional({
    description: "the minimum age required to play the game",
    example: 18,
  })
  age_rating?: number;

  @Column({ nullable: true })
  @Index()
  @ApiProperty({
    description: "title of the game",
    example: "Grand Theft Auto V",
  })
  title?: string;

  @Index()
  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "release date of the game",
    example: "2013-09-17T00:00:00.000Z",
  })
  release_date?: Date;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "description of the game",
    example:
      "An open world action-adventure video game developed by Rockstar North and published by Rockstar Games.",
  })
  description?: string;

  @Column({ nullable: true, type: "integer" })
  @ApiPropertyOptional({
    description: "average playtime of other people in the game in minutes",
    example: 180,
  })
  average_playtime?: number;

  @OneToOne(() => Media, {
    nullable: true,
    eager: true,
    onDelete: "CASCADE",
    orphanedRowAction: "soft-delete",
  })
  @JoinColumn()
  @ApiPropertyOptional({
    description: "cover/boxart image of the game",
    type: () => Media,
  })
  cover?: Media;

  @OneToOne(() => Media, {
    nullable: true,
    eager: true,
    onDelete: "CASCADE",
    orphanedRowAction: "soft-delete",
  })
  @JoinColumn()
  @ApiPropertyOptional({
    description: "background image of the game",
    type: () => Media,
  })
  background?: Media;

  @ManyToOne(() => Media, {
    nullable: true,
    eager: true,
    onDelete: "CASCADE",
    orphanedRowAction: "soft-delete",
  })
  @JoinColumn()
  @ApiPropertyOptional({
    description: "screenshots of the game",
    type: () => Media,
    isArray: true,
  })
  screenshots?: Media[];

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "website url of the game",
    example: "https://www.escapefromtarkov.com/",
  })
  url_website?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "rating of the provider",
    example: 90,
  })
  rating_provider?: number;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: "metacritic rating of the game",
    example: 90,
  })
  rating_metacritic?: number;

  @Column({ default: false })
  @ApiProperty({
    description: "indicates if the game is in early access",
    example: true,
  })
  early_access?: boolean;

  @JoinTable()
  @ManyToMany(() => PublisherMetadata, (publisher) => publisher.games)
  @ApiPropertyOptional({
    description: "publishers of the game",
    type: () => PublisherMetadata,
    isArray: true,
  })
  publishers?: PublisherMetadata[];

  @JoinTable()
  @ManyToMany(() => DeveloperMetadata, (developer) => developer.games)
  @ApiPropertyOptional({
    description: "developers of the game",
    type: () => DeveloperMetadata,
    isArray: true,
  })
  developers?: DeveloperMetadata[];

  @JoinTable()
  @ManyToMany(() => TagMetadata, (tag) => tag.games)
  @ApiPropertyOptional({
    description: "tags of the game",
    type: () => TagMetadata,
    isArray: true,
  })
  tags?: TagMetadata[];

  @JoinTable()
  @ManyToMany(() => GenreMetadata, (genre) => genre.games)
  @ApiPropertyOptional({
    description: "genres of the game",
    type: () => GenreMetadata,
    isArray: true,
  })
  genres?: GenreMetadata[];

  public getLoggableData() {
    return {
      id: this.id,
      provider_slug: this.provider_slug,
      provider_data_id: this.provider_data_id,
      provider_checksum: this.provider_checksum,
      updated_at: this.updated_at,
    };
  }
}
