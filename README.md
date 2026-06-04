# Gestor Acadêmico

[![CI](https://github.com/estermarreiro/gestor-academico/actions/workflows/ci.yml/badge.svg)](https://github.com/estermarreiro/gestor-academico/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EsterMarreiro_gestor-academico&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EsterMarreiro_gestor-academico)

Sistema de gestão acadêmica voltado para cadastro institucional, organização da oferta de ensino, vínculo entre alunos, professores, cursos, disciplinas e turmas, além de operações de matrícula e inscrição docente. Este `README` descreve o domínio e seus bounded contexts. A visão técnica do backend está em [server/README.md](server/README.md).

## Tema

O domínio parte de uma instituição que precisa organizar sua operação acadêmica sem entrar, por enquanto, em controle de aulas, avaliações, frequência ou calendário semestral. O foco atual está em:

- cadastro de usuários e papéis institucionais
- manutenção de cursos, disciplinas e turmas
- matrícula de alunos em cursos
- vínculo de alunos com turmas
- inscrição de professores para disciplinas
- estrutura técnica pronta para crescer com observabilidade, cache, resiliência e comunicação assíncrona

## Perfis de Usuário

### Administrador

Responsável pela gestão institucional do sistema. No modelo atual, o projeto já possui o indicador `isAdmin` no usuário, o que representa a distinção entre operação administrativa e operação comum.

É o perfil que faz mais sentido para:

- cadastrar e manter cursos, disciplinas e turmas
- aprovar ou recusar fluxos operacionais
- organizar a oferta disponível para alunos e professores

### Usuário Comum

Representa a identidade base da pessoa no sistema. A partir dessa identidade, o usuário pode evoluir para papéis acadêmicos específicos no domínio.

### Aluno

Representa o usuário que já possui identidade acadêmica de estudante. No código atual, `Aluno` é uma entidade própria ligada a `Usuario`, e é ela que participa de matrículas e vínculos com turmas.

### Professor

Representa o usuário que atua academicamente como docente. No código atual, `Professor` também é uma entidade própria ligada a `Usuario`, e se relaciona com disciplinas e inscrições docentes.

## Entidades Principais

### Usuario

Entidade que concentra os dados cadastrais base da pessoa:

- nome
- email
- senha
- CPF
- telefone
- data de nascimento
- endereço
- indicador administrativo

Ela é a porta de entrada para a identidade institucional, mas autenticação e autorização ainda não estão fechadas como módulo funcional completo na API.

### Aluno

Representa a identidade acadêmica do estudante. É vinculado a um `Usuario` e possui `numeroMatricula`, além de relacionamentos com:

- `Matricula`
- `AlunoTurma`

### Professor

Representa a identidade acadêmica do docente. É vinculado a um `Usuario` e pode se relacionar com:

- `Disciplina`
- `InscricaoProfessor`

### Curso

É a unidade de organização curricular. Um curso agrupa disciplinas e recebe matrículas de alunos.

### Disciplina

É o componente curricular do curso. No modelo atual, cada disciplina:

- pertence a um curso
- pode ter um professor responsável
- pode ter várias turmas
- pode receber inscrições de professor

### Turma

É a oferta operacional de uma disciplina. Possui código próprio, quantidade de vagas e relação com alunos por meio da entidade `AlunoTurma`.

### Matricula

Representa o vínculo entre `Aluno` e `Curso`. É uma entidade central do fluxo acadêmico e possui os estados:

- `pendente`
- `ativa`
- `em_fila`
- `recusada`

### AlunoTurma

Representa o vínculo operacional entre aluno e turma. No estado atual do projeto, esse vínculo existe como módulo próprio, separado da matrícula.

### InscricaoProfessor

Representa a solicitação ou vínculo de atuação docente em uma disciplina. Possui os estados:

- `pendente`
- `aprovada`
- `recusada`

## Value Objects Conceituais

Mesmo que parte deles esteja hoje materializada diretamente como campos no banco, o domínio continua sugerindo alguns objetos de valor importantes:

- `Endereco`: rua, número, cidade, estado, CEP e complemento
- `StatusMatricula`: pendente, ativa, em_fila, recusada
- `StatusInscricaoProfessor`: pendente, aprovada, recusada

## Bounded Contexts

### Contexto de Identidade e Cadastro

Esse contexto organiza a existência institucional das pessoas dentro do sistema. Ele começa em `Usuario` e se desdobra em representações acadêmicas próprias, como `Aluno` e `Professor`.

Sua responsabilidade é separar:

- a identidade civil e cadastral da pessoa
- a sua função acadêmica
- a sua eventual capacidade administrativa

Na prática, esse contexto sustenta todo o resto do sistema, porque matrícula, vínculo em turma e inscrição docente dependem primeiro da existência do usuário e, depois, da sua projeção acadêmica.

### Contexto de Catálogo Acadêmico

Esse contexto representa a estrutura da oferta da instituição. Ele é formado principalmente por `Curso`, `Disciplina` e `Turma`.

Seu papel é responder:

- quais cursos existem
- quais disciplinas pertencem a cada curso
- quais turmas estão abertas para cada disciplina
- quantas vagas operacionais cada turma possui

Como a regra atual não trabalha com semestres, o catálogo está modelado de forma mais direta: o curso concentra suas disciplinas, e as turmas representam a operacionalização dessa oferta.

### Contexto de Vida Acadêmica

Esse é o contexto onde o aluno de fato passa a existir como participante da operação acadêmica. Ele é formado por `Matricula` e `AlunoTurma`.

`Matricula` responde pelo vínculo do aluno com o curso. `AlunoTurma` responde pela associação do aluno a uma turma específica.

Essa separação é importante porque o código atual distingue duas camadas de operação:

- a decisão de matrícula no curso
- a distribuição do aluno em turma

Isso mantém o modelo mais explícito e evita que o vínculo com turma fique implícito dentro da matrícula.

### Contexto de Alocação Docente

Esse contexto é centrado em `InscricaoProfessor` e trata o interesse do usuário em atuar como professor em uma disciplina.

No backend atual, já existe uma regra objetiva: uma disciplina não aceita nova inscrição aprovada se ela já possui professor responsável ou se já existe outra inscrição aprovada para a mesma disciplina.

Esse contexto, portanto, controla:

- solicitação de atuação docente
- aprovação ou recusa da inscrição
- prevenção de duplicidade de ocupação da disciplina

### Contexto de Plataforma

Esse contexto não é de negócio puro, mas sustenta o comportamento do sistema como produto executável. Ele reúne capacidades já presentes no projeto:

- observabilidade
- resiliência
- cache
- versionamento
- comunicação em tempo real
- mensageria

Essas capacidades estão detalhadas tecnicamente em [server/README.md](server/README.md), mas já fazem parte do desenho atual do sistema.

## Fluxo do Domínio

### 1. Entrada do Usuário no Sistema

O ponto de partida é o cadastro de `Usuario`. O modelo de dados já contempla senha e indicador administrativo. Isso mostra que o sistema está preparado para diferenciar usuários comuns e usuários com papel de gestão.

No entanto, o código atual ainda não entrega um fluxo completo de autenticação e login como módulo dedicado. Por isso, a leitura correta hoje é:

- o cadastro base existe no domínio
- a ideia de login existe como direção do produto
- a autenticação propriamente dita ainda não está concluída na aplicação

### 2. Evolução para Aluno

Depois da existência do usuário, o domínio permite a criação da identidade `Aluno`, que é separada da identidade civil e recebe `numeroMatricula`.

No seu fluxo funcional desejado, esse usuário poderia solicitar entrada em um ou mais cursos. O backend atual já suporta o núcleo desse processo através da entidade `Matricula`, inclusive com os estados `pendente`, `ativa`, `em_fila` e `recusada`.

Isso significa que o sistema já comporta a ideia de:

- pedido em análise
- pedido aceito
- pedido em fila
- pedido recusado

Também já existe restrição de unicidade por `alunoId` e `cursoId`, então o mesmo aluno não pode abrir matrículas duplicadas para o mesmo curso. Em compensação, ele pode ter matrículas em cursos diferentes.

### 3. Aprovação, Fila e Recusa de Matrícula

No comportamento de domínio esperado:

- quando houver vaga e aceitação institucional, a matrícula se torna `ativa`
- quando não houver vaga, ela pode permanecer `em_fila`
- quando negada, ela fica `recusada`

Esse vocabulário já está presente no código.

O que ainda não está automatizado no backend atual é o passo narrativo de "ao ser aprovado, o aluno entra automaticamente na primeira turma disponível". Hoje, a distribuição em turma existe como operação separada no módulo `AlunoTurma`. Isso deixa o projeto em um estágio mais explícito:

- a matrícula aprova o vínculo com o curso
- o vínculo com a turma ainda é operado separadamente

### 4. Oferta de Conteúdo Acadêmico

Cada curso possui disciplinas associadas, e cada disciplina pode originar turmas. Como o projeto hoje não aplica semestralização, a leitura do domínio continua simples:

- o curso define a estrutura curricular
- a disciplina define o componente do curso
- a turma define a oferta operacional daquela disciplina

Isso está condizente com a modelagem do banco e com os módulos já existentes.

### 5. Evolução para Professor

Do lado docente, o usuário pode se desdobrar na entidade `Professor` e também pode registrar interesse de atuação por meio de `InscricaoProfessor`.

O backend atual já implementa a parte essencial desse fluxo:

- a inscrição nasce, por padrão, como `pendente`
- ela pode ser `aprovada` ou `recusada`
- uma disciplina não pode receber uma nova inscrição aprovada se já estiver ocupada

Essa regra está alinhada com a ideia de evitar que dois professores sejam aprovados para a mesma disciplina quando já há responsável definido.

## O Que Já Está Condizente com o Código

- cadastro de usuários, alunos, professores, cursos, disciplinas, turmas, matrículas e inscrições docentes
- estados explícitos de matrícula e inscrição de professor
- separação entre matrícula em curso e vínculo com turma
- restrição de unicidade para evitar duplicidades importantes
- estrutura de administração representada pelo campo `isAdmin`
- preparação técnica para Swagger, cache, resiliência, mensageria, observabilidade e realtime

## O Que Ainda É Evolução Natural do Produto

- autenticação e login completos
- aprovação administrativa formal com fluxo dedicado
- vinculação automática do aluno à primeira turma disponível após ativação da matrícula
- módulos de aulas, avaliações e frequência
- regras pedagógicas mais profundas

## Capacidades Técnicas Já Presentes

Mesmo que parte delas não seja protagonista do domínio neste momento, o sistema já dispõe de:

- API Gateway HTTP
- microserviços TCP por domínio
- cache com Redis e fallback em memória
- observabilidade com logs, health check, métricas, Prometheus e Grafana
- resiliência com retry, timeout, circuit breaker e bulkhead
- mensageria com RabbitMQ
- eventos em tempo real via WebSocket

Essas capacidades são descritas com mais detalhe em [server/README.md](server/README.md) e em [server/docs/observability.md](server/docs/observability.md).
