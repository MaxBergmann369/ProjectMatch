### `POST /chat`

Erstellt einen direkten Chat zwischen zwei Benutzern.

**Parameter:**

- `userId` (string): Die eindeutige ID des Benutzers, der den Chat erstellt.
- `otherUserId` (string): Die eindeutige ID des anderen Benutzers, mit dem der Chat erstellt wird.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: JSON-Objekt des erstellten direkten Chats (`DirectChat`)
- id: number;
- userId: string;
- otherUserId: string;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Chat not added"

### `GET /chat`

Ruft einen direkten Chat zwischen zwei Benutzern ab.

**Parameter:**

- `userId` (string): Die eindeutige ID des Benutzers, der den Chat erstellt hat.
- `otherUserId` (string): Die eindeutige ID des anderen Benutzers im Chat.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: JSON-Objekt des direkten Chats (`DirectChat`)
- id: number;
- userId: string;
- otherUserId: string;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Chat not found"

### `GET /chats`

Ruft alle direkten Chats eines Benutzers ab.

**Parameter:**

- `userId` (string): Die eindeutige ID des Benutzers.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Array von JSON-Objekten der direkten Chats (`DirectChat`)
- id: number;
- userId: string;
- otherUserId: string;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Chats not found"

### `DELETE /chat`

Löscht einen direkten Chat zwischen zwei Benutzern.

**Parameter:**

- `userId` (string): Die eindeutige ID des Benutzers, der den Chat erstellt hat.
- `otherUserId` (string): Die eindeutige ID des anderen Benutzers im Chat.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Chat deleted"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Chat not deleted"

### `POST /message`

Fügt eine Nachricht zu einem Chat hinzu.

**Parameter:**

- `chatId` (string): Die eindeutige ID des Chats, zu dem die Nachricht hinzugefügt wird.
- `userId` (string): Die eindeutige ID des Benutzers, der die Nachricht sendet.
- `message` (string): Die Nachricht, die gesendet wird.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Message added"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Message not added"

### `GET /messages`

Ruft alle Nachrichten eines Chats ab.

**Parameter:**

- `chatId` (string): Die eindeutige ID des Chats.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Array von JSON-Objekten der Nachrichten (`Message`)
- id: number;
- chatId: number;
- userId: string;
- message: string;
- date: Date;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Messages not found"

### `PUT /message`

Aktualisiert eine Nachricht in einem Chat.

**Parameter:**

- `messageId` (string): Die eindeutige ID der zu aktualisierenden Nachricht.
- `chatId` (string): Die eindeutige ID des Chats, in dem sich die Nachricht befindet.
- `userId` (string): Die eindeutige ID des Benutzers, der die Nachricht gesendet hat.
- `message` (string): Die aktualisierte Nachricht.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Message updated"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Message not updated"

### `DELETE /message`

Löscht eine Nachricht aus einem Chat.

**Parameter:**

- `userId` (string): Die eindeutige ID des Benutzers, der die Nachricht gesendet hat.
- `messageId` (string): Die eindeutige ID der zu löschenden Nachricht.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Message deleted"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Message not deleted"
