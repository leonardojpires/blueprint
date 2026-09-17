Server types are grouped by purpose:

- `auth.ts`: authenticated request contract.
- `express.d.ts`: Express request augmentation.
- `database.ts`: MySQL row shapes.
- `groq.ts`: conversation messages and generation results.
- `studyPlan.ts`: study-plan domain constructor properties.

Use `import type` for these contracts. Request/response DTOs remain in `dtos/`;
repository and service interfaces remain in their existing dedicated `I*.ts`
files beside their implementations. Keep database rows separate from DTOs and
domain constructor properties, since they describe different boundaries.
