 # Bounded Context — Sistema de Gestão Acadêmica

## Tema
Sistema web para gestão acadêmica com controle de alunos, professores e administradores, cobrindo matrículas, turmas, notas e comunicação interna. Arquitetura em monolito modular, podendo ser migrado para microsserviços no futuro para questões de mensageria e notificações.

---

## Perfis de Usuário
| Perfil | Responsabilidades |
|---|---|
| `ADMIN` | Gerencia usuários, cursos, turmas e relatórios |
| `PROFESSOR` | Gerencia turmas, lança notas e presenças |
| `ALUNO` | Acessa turmas, notas, materiais e comunicados |

---

## 🧩 Entidades
| Entidade | Descrição |
|---|---|
| `Usuario` | Dados pessoais, endereço e tipo de perfil (ADMIN, PROFESSOR, ALUNO) |
| `Curso` | Agrupa disciplinas de uma grade curricular |
| `Disciplina` | Matéria pertencente a um curso com carga horária |
| `Turma` | Oferta de uma disciplina em um período com professor e vagas |
| `Matricula` | Vínculo entre aluno e turma |
| `Aula` | Registro de aula de uma turma com data e conteúdo |
| `Presenca` | Registro de presença do aluno por aula |
| `Avaliacao` | Lançamento de nota por aluno/turma com tipo e resultado |
| `Notificacao` | Comunicados internos enviados aos usuários |

---

## Value Objects
| Value Object | Atributos |
|---|---|
| `Endereco` | rua, numero, bairro, cidade, estado, cep |
| `Resultado` | valor, peso |
| `PeriodoAcademico` | semestre, ano |

---

## Organização em Camadas
```
server/src/
├── modules/
│   ├── usuarios/
│   ├── auth/
│   ├── cursos/
│   ├── disciplinas/
│   ├── turmas/
│   ├── matriculas/
│   ├── aulas/
│   ├── avaliacoes/
│   └── notificacoes/
└── shared/
    ├── prisma/
    ├── guards/
    ├── decorators/
    └── interceptors/
```

## 🔧 Infraestrutura
| Recurso | Tecnologia |
|---|---|
| Backend | NestJS |
| Frontend | React Native |
| Banco de dados | PostgreSQL + Prisma 6 |
| Autenticação | JWT |
| Cache | Redis |
| Containerização | Docker + Docker Compose |

---

# 📚 Identificação de Entidades e Value Objects

Na **Plataforma de Gestão Acadêmica Simplificada**, alguns elementos possuem **identidade própria e ciclo de vida**, sendo classificados como **Entidades**.

Outros são definidos apenas por seus **atributos**, não possuindo identidade única, sendo classificados como **Value Objects**.

---

# 🧩 Entidades

## 👨‍🎓 Aluno
Representa um estudante dentro da instituição e possui identidade única.

**Atributos possíveis:**

- `id`
- `nome`
- `email`
- `matricula`
- `curso`
- `data_de_ingresso`
- `status`

**Importância da entidade:**

A identidade do aluno é fundamental para:

- Realizar matrículas  
- Receber avaliações  
- Receber notificações acadêmicas  

---

## 📖 Disciplina
Representa uma matéria oferecida pela instituição.

**Atributos possíveis:**

- `id`
- `nome`
- `carga_horaria`
- `professor`
- `periodo`
- `numero_de_vagas`

**Função no sistema:**

Sua identidade permite que a disciplina seja referenciada em:

- Matrículas  
- Avaliações  

---

## 📝 Matrícula
Representa o vínculo entre **Aluno** e **Disciplina**.

**Atributos possíveis:**

- `id`
- `aluno_id`
- `disciplina_id`
- `data_matricula`
- `status`

**Função no sistema:**

Essa entidade registra quando um aluno está cursando determinada disciplina.

---

## 📊 Avaliação
Representa uma avaliação aplicada dentro de uma disciplina.

**Atributos possíveis:**

- `id`
- `aluno_id`
- `disciplina_id`
- `tipo` (prova, trabalho, atividade)
- `resultado`
- `data_avaliacao`
- `nota`

**Função no sistema:**

Permite registrar o **desempenho acadêmico do aluno**.

---

## 🔔 Notificação
Representa mensagens enviadas ao aluno.

**Atributos possíveis:**

- `id`
- `aluno_id`
- `mensagem`
- `tipo`
- `data_envio`
- `status`

**Pode ser utilizada para:**

- Avisos de matrícula  
- Divulgação de resultados  
- Comunicados institucionais  

---

# 📦 Value Objects


## 📍 Endereço
Composto por:

- `rua`
- `numero`
- `bairro`
- `cidade`
- `estado`
- `cep`

Dois endereços são considerados iguais se **todos os atributos forem iguais**.

---

## 📊 Resultado
Composto por:

- `valor`
- `peso`

Representa o valor de uma avaliação e é utilizado dentro da entidade **Avaliação**.

---

## 📅 Período Acadêmico
Composto por:

- `semestre`
- `ano`

Define o período acadêmico de uma disciplina.

---

## ✉️ Email
Composto por:

- `endereco`

Representa o endereço eletrônico de um aluno.

# 🧭 Definição de Bounded Contexts

Na **Plataforma de Gestão Acadêmica Simplificada**, os módulos podem ser organizados em diferentes **Bounded Contexts**, onde cada contexto possui seu próprio **modelo de domínio** e **linguagem ubíqua**.

---

## 👨‍🎓 1. Contexto de Alunos (Student Context)

**Linguagem Ubíqua**

- Aluno
- Cadastro
- Perfil
- Curso
- Informações Acadêmicas

**Entidade Principal**

- `Aluno`

**Responsabilidades**

- Gerenciar cadastro de alunos  
- Atualizar informações acadêmicas  
- Consultar dados do aluno  

---

## 📚 2. Contexto de Disciplinas (Course Context)

**Linguagem Ubíqua**

- Disciplina
- Professor
- Carga Horária
- Turma

**Entidades Principais**

- `Disciplina`
- `Período`

**Responsabilidades**

- Gerenciar disciplinas oferecidas  
- Definir carga horária  
- Organizar disciplinas por período  

---

## 📝 3. Contexto de Matrículas (Enrollment Context)

**Linguagem Ubíqua**

- Matrícula
- Aluno Matriculado
- Inscrição
- Cancelamento

**Entidade Principal**

- `Matrícula`

**Responsabilidades**

- Registrar matrícula em disciplinas  
- Controlar status da matrícula  
- Emitir eventos de matrícula  

---

## 📊 4. Contexto de Avaliações (Assessment Context)

**Linguagem Ubíqua**

- Avaliação
- Prova
- Resultado
- Nota

**Entidade Principal**

- `Avaliação`

**Responsabilidades**

- Registrar avaliações  
- Calcular notas  
- Consultar desempenho acadêmico  

---

## 🔔 5. Contexto de Notificações (Notification Context)

**Linguagem Ubíqua**

- Notificação
- Mensagem
- Alerta
- Comunicado

**Entidade Principal**

- `Notificação`

**Responsabilidades**

- Enviar notificações aos alunos  
- Informar novas matrículas  
- Avisar divulgação de notas  
