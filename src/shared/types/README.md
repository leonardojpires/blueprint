Frontend types are grouped by purpose:

- `auth.ts`: user identity, authentication context, and authentication responses.
- `chat.ts`: chat messages, generation responses, and the chat hook contract.
- `studyPlan.ts`: saved plans, previews, weeks, and saved-plan responses.
- `components.ts`: component props.
- `navigation.ts`: navigation items and route state.
- `theme.ts` and `toast.ts`: provider state and context contracts.

Import types directly from their owning module with `import type`. Components
and hooks consume these contracts; shared data types should not be exported
from implementation files. Frontend JSON types remain separate from server
domain objects and database rows, which can contain Dates and class methods.
