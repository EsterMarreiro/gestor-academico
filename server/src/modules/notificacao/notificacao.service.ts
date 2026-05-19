import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from './dto/update-notificacao.dto';
import { NotificacaoGateway } from './notificacao.gateway';

export type NotificacaoPayload = {
  id: number;
  titulo: string;
  mensagem: string;
  usuarioId?: number | null;
  criadoEm: Date;
  atualizadoEm: Date;
  deletadoEm?: Date | null;
};

@Injectable()
export class NotificacaoService {
  private static readonly CACHE_KEY = 'notificacoes:list';
  private static readonly CACHE_TTL_SECONDS = 3600;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly notificacaoGateway: NotificacaoGateway,
  ) {}

  private async getCachedNotifications(): Promise<NotificacaoPayload[]> {
    return (
      (await this.cacheManager.get<NotificacaoPayload[]>(
        NotificacaoService.CACHE_KEY,
      )) ?? []
    );
  }

  private async refreshCache(): Promise<NotificacaoPayload[]> {
    const notifications = await this.prisma.notificacao.findMany({
      where: { deletadoEm: null },
      orderBy: { criadoEm: 'desc' },
      take: 100,
    });
    await this.cacheManager.set(
      NotificacaoService.CACHE_KEY,
      notifications,
      NotificacaoService.CACHE_TTL_SECONDS,
    );
    return notifications;
  }

  async create(createNotificacaoDto: CreateNotificacaoDto) {
    const notification = await this.prisma.notificacao.create({
      data: {
        titulo: createNotificacaoDto.titulo,
        mensagem: createNotificacaoDto.mensagem,
        usuarioId: createNotificacaoDto.usuarioId ?? null,
      },
    });

    const list = [notification, ...(await this.getCachedNotifications())].slice(
      0,
      100,
    );
    await this.cacheManager.set(
      NotificacaoService.CACHE_KEY,
      list,
      NotificacaoService.CACHE_TTL_SECONDS,
    );
    this.notificacaoGateway.broadcastNotification(notification);
    return notification;
  }

  async findAll() {
    const cache = await this.getCachedNotifications();
    if (cache.length > 0) {
      return cache;
    }
    return this.refreshCache();
  }

  async findOne(id: number) {
    const notification = await this.prisma.notificacao.findFirst({
      where: { id, deletadoEm: null },
    });
    if (!notification) {
      throw new NotFoundException(`Notificação ${id} não encontrada`);
    }
    return notification;
  }

  async update(id: number, updateNotificacaoDto: UpdateNotificacaoDto) {
    const existing = await this.findOne(id);
    const updated = await this.prisma.notificacao.update({
      where: { id },
      data: {
        titulo: updateNotificacaoDto.titulo ?? existing.titulo,
        mensagem: updateNotificacaoDto.mensagem ?? existing.mensagem,
        usuarioId: updateNotificacaoDto.usuarioId ?? existing.usuarioId ?? null,
      },
    });
    await this.refreshCache();
    this.notificacaoGateway.broadcastNotification(updated);
    return updated;
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    await this.prisma.notificacao.update({
      where: { id },
      data: { deletadoEm: new Date() },
    });
    await this.refreshCache();
    return { removed: true, id: existing.id };
  }
}
