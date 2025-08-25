import { Controller, Get, Post, UseGuards, Body, Query, UploadedFile, UseInterceptors, Req, Delete, Patch, Param } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ContactsService } from './contacts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('contacts')
@UseGuards(JwtGuard)
export class ContactsController {
  constructor(private service: ContactsService) {}

  @Get()
  async list(@Req() req: any, @Query('startsWith') startsWith?: string) {
    const ownerId = req.user.sub;
    return this.service.list(ownerId, startsWith);
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: 'uploads/contacts',
      filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
        cb(null, unique + extname(file.originalname));
      }
    })
  }))
  async create(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const ownerId = req.user.sub;
    const photoUrl = file ? `/uploads/contacts/${file.filename}` : undefined;
    return this.service.create(ownerId, { ...body, photoUrl });
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const ownerId = req.user.sub;
    return this.service.delete(ownerId, id);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const ownerId = req.user.sub;
    return this.service.update(ownerId, id, body);
  }

  @Get(':id')
  async getOne(@Req() req: any, @Param('id') id: string) {
    const ownerId = req.user.sub;
    return this.service.getOne(ownerId, id);
  }


}