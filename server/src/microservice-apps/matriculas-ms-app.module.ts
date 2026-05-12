import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { MatriculaMicroserviceModule } from '../modules/matricula/matricula.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MatriculaMicroserviceModule,
  ],
})
export class MatriculasMsAppModule {}
