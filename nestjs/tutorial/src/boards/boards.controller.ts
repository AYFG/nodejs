import { BoardsService } from './boards.service';
import { Controller } from '@nestjs/common';

@Controller('boards')
export class BoardsController {
  constructor(private BoardsService: BoardsService) {}
}
