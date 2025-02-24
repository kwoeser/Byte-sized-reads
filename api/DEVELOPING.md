# Developing the API

- Install Node.js and pnpm
- `pnpm install`
- Create a `.env` file with the following format:
```env
DATABASE_URL=
PORT=
```
- `DATABASE_URL` should be a connection string for a Postgres database. The backend will use a database called `project`.
- `PORT` is optional and defaults to 5174.
