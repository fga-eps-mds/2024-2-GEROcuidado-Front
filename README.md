# gerocuidado-usuario-api

## Configuração

Definir valores iguais para os arquivos .env e docker-compose

Arquivo .env.development e .env.test:

    #POSTGRES
    DB_TYPE=
    DB_HOST=
    DB_USERNAME=
    DB_PASS=
    DB_DATABASE=
    DB_PORT=
    JWT_TOKEN_SECRET=
    JWT_TOKEN_EXPIRES_IN=
    HASH_SALT=

Arquivo .docker-compose, na seção **_environment_**:

    ...
    environment:
      - POSTGRES_DB=
      - POSTGRES_USER=
      - POSTGRES_PASSWORD=
    ...

Da mesma forma, alterar os valores das portas terminadas em **_x_** (i.e 300x para 3001) para a porta desejada nos arquivos de compose, bem como no arquivo launch.json da pasta .vscode.

## Execução

  Para subir a aplicação, basta rodar o comando:

  ```bash
  docker compose up
  ```

## Testes

  Para testar a aplicação, suba o container de testes:

  ```bash
    TEST=dev docker compose -f docker-compose.test.yml up
  ```

 E rode os comandos para os testes unitários e E2E respectivamente (:cov gera o arquivo de coverage na raiz do projeto):
  ```bash
    npm run test:cov
    npm run test:e2e:cov
  ```

 ## Migrations

  Sempre que houver qualquer alteração em alguma entidade na aplicação (adicionar uma entidade, remover ou edita-la), deve ser gerada uma migration para sincronizar o banco de dados.

  1. Entrar no container da api:

  ```bash
    docker exec -it gerocuidado-usuario-api bash
  ```

  2. Rodar o comando de criar uma migration (tente dar um nome descritivo, ex.: CreateTableUsuario)

  ```bash
    npm run typeorm:migrate src/migration/NOME_DA_MIGRATION
  ```

# Dicionário variáveis de ambiente

| ENV                  | Descrição                 | Valor Padrão           |
| -------------------- | ------------------------- | ---------------------- |
| DB_TYPE              | tipo do banco             | postgres               |
| DB_HOST              | host do PostgreSQL        | localhost              |
| DB_USERNAME          | usuário do PostgreSQL     | postgres               |
| DB_PASS              | senha do PostgreSQL       | postgres               |
| DB_DATABASE          | database do PostgreSQL    | gerocuidado-usuario-db |
| DB_PORT              | porta do PostgreSQL       | 5001                   |
| JWT_TOKEN_SECRET     | secret do JWT             |                        |
| JWT_TOKEN_EXPIRES_IN | tempo de expiração do JWT | 12h                    |
| HASH_SALT            | saltRounds da senha       | 10                     |
