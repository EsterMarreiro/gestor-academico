import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { CursosModule } from './modules/cursos/cursos.module';
import { DisciplinaModule } from './modules/disciplina/disciplina.module';
import { UsuariosGatewayModule } from './gateway/usuarios.gateway.module';
import { TurmasGatewayModule } from './gateway/turmas.gateway.module';
import { MatriculaModule } from './modules/matricula/matricula.module';
import { AulaModule } from './modules/aula/aula.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsuariosGatewayModule,
    TurmasGatewayModule,
    CursosModule,
    DisciplinaModule,
    MatriculaModule,
    AulaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
