-- CreateTable
CREATE TABLE "aula" (
    "id" SERIAL NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "titulo" TEXT,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "conteudo" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "aula_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
