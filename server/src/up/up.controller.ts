import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { readdirSync } from 'fs';

@Controller('up')
export class UpController {
  @Get('list')
  listFiles(@Res() res) {
    // Используем process.cwd() для получения корня проекта
    const uploadDir = join(process.cwd(), 'uploads');
    try {
      const files = readdirSync(uploadDir);
      return res.json(files);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to read uploads directory', error: error.message });
    }
  }
}
