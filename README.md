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

