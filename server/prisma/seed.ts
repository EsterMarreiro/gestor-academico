import {
  PrismaClient,
  StatusInscricaoProfessor,
  StatusMatricula,
} from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.alunoTurma.deleteMany();
  await prisma.inscricaoProfessor.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.disciplina.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.usuario.deleteMany();
}

async function main() {
  await resetDatabase();

  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        nome: 'Administrador Geral',
        email: 'admin@gestor.local',
        senha: 'admin123',
        cpf: '00000000001',
        telefone: '11999990001',
        dataNascimento: new Date('1985-01-10'),
        cep: '01001000',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Rua da Administracao',
        numero: '100',
        complemento: 'Sala 1',
        isAdmin: true,
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Ana Silva',
        email: 'ana.aluna@gestor.local',
        senha: 'aluno123',
        cpf: '00000000002',
        telefone: '11999990002',
        dataNascimento: new Date('2001-03-12'),
        cep: '01001001',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Rua das Alunas',
        numero: '101',
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Bruno Costa',
        email: 'bruno.aluno@gestor.local',
        senha: 'aluno123',
        cpf: '00000000003',
        telefone: '11999990003',
        dataNascimento: new Date('2000-07-20'),
        cep: '01001002',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Rua dos Estudantes',
        numero: '202',
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Carla Mendes',
        email: 'carla.aluna@gestor.local',
        senha: 'aluno123',
        cpf: '00000000004',
        telefone: '11999990004',
        dataNascimento: new Date('2002-02-15'),
        cep: '01001003',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Avenida Academica',
        numero: '303',
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Diego Lima',
        email: 'diego.aluno@gestor.local',
        senha: 'aluno123',
        cpf: '00000000005',
        telefone: '11999990005',
        dataNascimento: new Date('1999-11-08'),
        cep: '01001004',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Rua do Campus',
        numero: '404',
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Elisa Rocha',
        email: 'elisa.aluna@gestor.local',
        senha: 'aluno123',
        cpf: '00000000006',
        telefone: '11999990006',
        dataNascimento: new Date('2003-06-19'),
        cep: '01001005',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Travessa Universitaria',
        numero: '505',
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Joana Freitas',
        email: 'joana.prof@gestor.local',
        senha: 'prof1234',
        cpf: '00000000007',
        telefone: '11999990007',
        dataNascimento: new Date('1980-09-22'),
        cep: '01001006',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Rua dos Professores',
        numero: '10',
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Marcos Teixeira',
        email: 'marcos.prof@gestor.local',
        senha: 'prof1234',
        cpf: '00000000008',
        telefone: '11999990008',
        dataNascimento: new Date('1978-12-05'),
        cep: '01001007',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Rua dos Docentes',
        numero: '20',
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Renata Borges',
        email: 'renata.prof@gestor.local',
        senha: 'prof1234',
        cpf: '00000000009',
        telefone: '11999990009',
        dataNascimento: new Date('1987-04-17'),
        cep: '01001008',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Alameda Pedagogica',
        numero: '30',
      },
    }),
    prisma.usuario.create({
      data: {
        nome: 'Paulo Nascimento',
        email: 'paulo.prof@gestor.local',
        senha: 'prof1234',
        cpf: '00000000010',
        telefone: '11999990010',
        dataNascimento: new Date('1983-08-27'),
        cep: '01001009',
        estado: 'SP',
        cidade: 'Sao Paulo',
        rua: 'Avenida da Docencia',
        numero: '40',
      },
    }),
  ]);

  const [
    adminUsuario,
    anaUsuario,
    brunoUsuario,
    carlaUsuario,
    diegoUsuario,
    elisaUsuario,
    joanaUsuario,
    marcosUsuario,
    renataUsuario,
    pauloUsuario,
  ] = usuarios;

  const alunos = await Promise.all([
    prisma.aluno.create({
      data: {
        usuarioId: anaUsuario.id,
        numeroMatricula: 'MAT2026001',
      },
    }),
    prisma.aluno.create({
      data: {
        usuarioId: brunoUsuario.id,
        numeroMatricula: 'MAT2026002',
      },
    }),
    prisma.aluno.create({
      data: {
        usuarioId: carlaUsuario.id,
        numeroMatricula: 'MAT2026003',
      },
    }),
    prisma.aluno.create({
      data: {
        usuarioId: diegoUsuario.id,
        numeroMatricula: 'MAT2026004',
      },
    }),
    prisma.aluno.create({
      data: {
        usuarioId: elisaUsuario.id,
        numeroMatricula: 'MAT2026005',
      },
    }),
  ]);

  const [anaAluno, brunoAluno, carlaAluno, diegoAluno, elisaAluno] = alunos;

  const professores = await Promise.all([
    prisma.professor.create({
      data: {
        usuarioId: joanaUsuario.id,
        titulacao: 'Mestre em Ciencia da Computacao',
      },
    }),
    prisma.professor.create({
      data: {
        usuarioId: marcosUsuario.id,
        titulacao: 'Doutor em Sistemas de Informacao',
      },
    }),
    prisma.professor.create({
      data: {
        usuarioId: renataUsuario.id,
        titulacao: 'Especialista em Engenharia de Software',
      },
    }),
    prisma.professor.create({
      data: {
        usuarioId: pauloUsuario.id,
        titulacao: 'Mestre em Redes de Computadores',
      },
    }),
  ]);

  const [joanaProfessor, marcosProfessor, renataProfessor, pauloProfessor] =
    professores;

  const cursos = await Promise.all([
    prisma.curso.create({
      data: {
        nome: 'Analise e Desenvolvimento de Sistemas',
        descricao: 'Curso focado em desenvolvimento de software e banco de dados.',
      },
    }),
    prisma.curso.create({
      data: {
        nome: 'Sistemas de Informacao',
        descricao: 'Curso voltado para gestao, integracao e arquitetura de sistemas.',
      },
    }),
    prisma.curso.create({
      data: {
        nome: 'Ciencia da Computacao',
        descricao: 'Curso com base teorica e pratica em computacao.',
      },
    }),
  ]);

  const [adsCurso, siCurso, ccCurso] = cursos;

  const disciplinas = await Promise.all([
    prisma.disciplina.create({
      data: {
        nome: 'Algoritmos',
        descricao: 'Fundamentos de logica e algoritmos.',
        cursoId: adsCurso.id,
        professorId: joanaProfessor.id,
      },
    }),
    prisma.disciplina.create({
      data: {
        nome: 'Banco de Dados',
        descricao: 'Modelagem relacional e consultas SQL.',
        cursoId: adsCurso.id,
        professorId: marcosProfessor.id,
      },
    }),
    prisma.disciplina.create({
      data: {
        nome: 'Engenharia de Software',
        descricao: 'Processos, requisitos e arquitetura de software.',
        cursoId: siCurso.id,
      },
    }),
    prisma.disciplina.create({
      data: {
        nome: 'Redes de Computadores',
        descricao: 'Topologias, protocolos e servicos de rede.',
        cursoId: siCurso.id,
      },
    }),
    prisma.disciplina.create({
      data: {
        nome: 'Estruturas de Dados',
        descricao: 'Listas, pilhas, filas e arvores.',
        cursoId: ccCurso.id,
      },
    }),
    prisma.disciplina.create({
      data: {
        nome: 'Inteligencia Artificial',
        descricao: 'Conceitos introdutorios de IA e aprendizado de maquina.',
        cursoId: ccCurso.id,
      },
    }),
  ]);

  const [
    algoritmosDisciplina,
    bancoDadosDisciplina,
    engSoftwareDisciplina,
    redesDisciplina,
    estruturasDisciplina,
    iaDisciplina,
  ] = disciplinas;

  const turmas = await Promise.all([
    prisma.turma.create({
      data: {
        codigo: 'ADS-ALG-2026-1',
        disciplinaId: algoritmosDisciplina.id,
        vagasTotal: 40,
      },
    }),
    prisma.turma.create({
      data: {
        codigo: 'ADS-BD-2026-1',
        disciplinaId: bancoDadosDisciplina.id,
        vagasTotal: 35,
      },
    }),
    prisma.turma.create({
      data: {
        codigo: 'SI-ES-2026-1',
        disciplinaId: engSoftwareDisciplina.id,
        vagasTotal: 30,
      },
    }),
    prisma.turma.create({
      data: {
        codigo: 'SI-RED-2026-1',
        disciplinaId: redesDisciplina.id,
        vagasTotal: 25,
      },
    }),
    prisma.turma.create({
      data: {
        codigo: 'CC-ED-2026-1',
        disciplinaId: estruturasDisciplina.id,
        vagasTotal: 20,
      },
    }),
    prisma.turma.create({
      data: {
        codigo: 'CC-IA-2026-1',
        disciplinaId: iaDisciplina.id,
        vagasTotal: 20,
      },
    }),
  ]);

  const [
    turmaAlgoritmos,
    turmaBancoDados,
    turmaEngSoftware,
    turmaRedes,
    turmaEstruturas,
    turmaIA,
  ] = turmas;

  await prisma.matricula.createMany({
    data: [
      {
        alunoId: anaAluno.id,
        cursoId: adsCurso.id,
        status: StatusMatricula.ativa,
      },
      {
        alunoId: anaAluno.id,
        cursoId: siCurso.id,
        status: StatusMatricula.pendente,
      },
      {
        alunoId: brunoAluno.id,
        cursoId: adsCurso.id,
        status: StatusMatricula.em_fila,
      },
      {
        alunoId: carlaAluno.id,
        cursoId: ccCurso.id,
        status: StatusMatricula.recusada,
      },
      {
        alunoId: diegoAluno.id,
        cursoId: siCurso.id,
        status: StatusMatricula.ativa,
      },
      {
        alunoId: elisaAluno.id,
        cursoId: ccCurso.id,
        status: StatusMatricula.ativa,
      },
    ],
  });

  await prisma.alunoTurma.createMany({
    data: [
      {
        alunoId: anaAluno.id,
        turmaId: turmaAlgoritmos.id,
      },
      {
        alunoId: anaAluno.id,
        turmaId: turmaBancoDados.id,
      },
      {
        alunoId: diegoAluno.id,
        turmaId: turmaEngSoftware.id,
      },
      {
        alunoId: diegoAluno.id,
        turmaId: turmaRedes.id,
      },
      {
        alunoId: elisaAluno.id,
        turmaId: turmaEstruturas.id,
      },
      {
        alunoId: elisaAluno.id,
        turmaId: turmaIA.id,
      },
    ],
  });

  await prisma.inscricaoProfessor.createMany({
    data: [
      {
        usuarioId: joanaUsuario.id,
        disciplinaId: algoritmosDisciplina.id,
        status: StatusInscricaoProfessor.aprovada,
      },
      {
        usuarioId: marcosUsuario.id,
        disciplinaId: bancoDadosDisciplina.id,
        status: StatusInscricaoProfessor.aprovada,
      },
      {
        usuarioId: renataUsuario.id,
        disciplinaId: engSoftwareDisciplina.id,
        status: StatusInscricaoProfessor.pendente,
      },
      {
        usuarioId: pauloUsuario.id,
        disciplinaId: redesDisciplina.id,
        status: StatusInscricaoProfessor.recusada,
      },
      {
        usuarioId: renataUsuario.id,
        disciplinaId: iaDisciplina.id,
        status: StatusInscricaoProfessor.aprovada,
      },
      {
        usuarioId: pauloUsuario.id,
        disciplinaId: estruturasDisciplina.id,
        status: StatusInscricaoProfessor.pendente,
      },
    ],
  });

  await prisma.disciplina.update({
    where: { id: iaDisciplina.id },
    data: { professorId: renataProfessor.id },
  });

  console.log('Seed executado com sucesso.');
  console.log(
    JSON.stringify(
      {
        usuarios: usuarios.length,
        alunos: alunos.length,
        professores: professores.length,
        cursos: cursos.length,
        disciplinas: disciplinas.length,
        turmas: turmas.length,
        matriculas: 6,
        alunosTurma: 6,
        inscricoesProfessor: 6,
        admin: {
          email: adminUsuario.email,
          senha: 'admin123',
        },
        exemplos: {
          aluno: {
            email: anaUsuario.email,
            senha: 'aluno123',
            matricula: 'MAT2026001',
          },
          professor: {
            email: joanaUsuario.email,
            senha: 'prof1234',
          },
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error('Falha ao executar seed.', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
