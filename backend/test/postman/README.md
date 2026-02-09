# Postman import

## Files

- `opg-backend.postman_collection.json`: API requests (Health + Weather)
- `opg-backend.postman_environment.json`: Local environment with `baseUrl`

## Import steps (Postman)

1. Open Postman.
2. Click **Import**.
3. Import both JSON files from this folder.
4. In the top-right environment dropdown, select **OPG Backend Local**.
5. Send requests.

## Prerequisite

Run the backend locally (from `backend/`):

```bash
npm run dev
```

Default base URL is `http://localhost:4000`.

