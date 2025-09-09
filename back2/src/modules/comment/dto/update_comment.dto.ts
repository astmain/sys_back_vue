import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create_comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
