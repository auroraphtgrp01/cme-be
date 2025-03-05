import { DatabaseService } from '@/core/database/database.service';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new Logger(FileService.name);

}
