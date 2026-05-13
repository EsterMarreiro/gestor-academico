import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UsuariosGatewayModule } from './gateway/usuarios.gateway.module';
import { TurmasGatewayModule } from './gateway/turmas.gateway.module';
import { CursosGatewayModule } from './gateway/cursos.gateway.module';
import { DisciplinasGatewayModule } from './gateway/disciplinas.gateway.module';
import { MatriculasGatewayModule } from './gateway/matriculas.gateway.module';
import { AulasGatewayModule } from './gateway/aulas.gateway.module';
import { AlunosGatewayModule } from './gateway/alunos.gateway.module';
import { ProfessoresGatewayModule } from './gateway/professores.gateway.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsuariosGatewayModule,
    TurmasGatewayModule,
    CursosGatewayModule,
    DisciplinasGatewayModule,
    MatriculasGatewayModule,
    AulasGatewayModule,
    AlunosGatewayModule,
    ProfessoresGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
