import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  list(ownerId: number, startsWith?: string) {
    return this.prisma.contact.findMany({
      where: {
        ownerId,
        ...(startsWith ? { name: { startsWith, mode: 'insensitive' } } : {})
      },
      select: { id: true, name: true, email: true, phone: true, photoUrl: true },
      orderBy: { name: 'asc' }
    });
  }

  create(ownerId: number, data: any) {
    return this.prisma.contact.create({ data: { ...data, ownerId }});
  }

  async getOne(ownerId: number, contactId: string) {
  const id = Number(contactId);
  const contact = await this.prisma.contact.findFirst({
    where: { id, ownerId },
  });
  if (!contact) throw new NotFoundException('Contato não encontrado');
  return contact;
}

async update(ownerId: number, contactId: string, data: any) {
  const id = Number(contactId);
  await this.getOne(ownerId, contactId);
  return this.prisma.contact.update({
    where: { id },
    data,
  });
}

async delete(ownerId: number, contactId: string) {
  const id = Number(contactId);
  await this.getOne(ownerId, contactId);
  return this.prisma.contact.delete({ where: { id } });
}

}