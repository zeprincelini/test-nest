import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'My First Blog Post',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, { message: 'Minimum must be 3 characters' })
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the content of my post...',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({
    description: 'Author ID',
    example: 1,
    required: false,
  })
  @IsNumber()
  authorId?: number;
}
