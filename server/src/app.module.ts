import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { CursosModule } from './modules/cursos/cursos.module';
import { DisciplinaModule } from './modules/disciplina/disciplina.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsuariosModule,
    CursosModule,
    DisciplinaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
