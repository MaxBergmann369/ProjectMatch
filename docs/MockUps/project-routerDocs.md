### `POST /project`

Erstellt ein neues Projekt.

**Parameter:**

- `name` (string): Der Name des Projekts.
- `ownerId` (string): Die eindeutige ID des Projektbesitzers.
- `thumbnail` (string): Der Thumbnail-Link des Projekts.
- `description` (string): Die Beschreibung des Projekts.
- `links` (string[]): Eine Liste von Links zum Projekt.
- `maxMembers` (number): Die maximale Anzahl von Mitgliedern im Projekt.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Project added"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project not added"

---

### `GET /project`

Ruft die Informationen eines Projekts ab.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: JSON-Objekt des Projekts (`Project`)
- id: number;
- name: string;
- ownerId: string;
- thumbnail: string;
- description: string;
- dateOfCreation: Date;
- links: string;
- maxMembers: number;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project not found"

---

### `GET /projects`

Ruft alle Projekte ab.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Array-JSON-Objekt des Projekts (`Project`)
- id: number;
- name: string;
- ownerId: string;
- thumbnail: string;
- description: string;
- dateOfCreation: Date;
- links: string;
- maxMembers: number;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Projects not found"

---

### `GET /myProjects`

Ruft alle Projekte ab, bei denen der Benutzer Besitzer ist.

**Parameter:**

- `userId` (string): Die eindeutige ID des Benutzers.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Liste der Projekte, bei denen der Benutzer Besitzer ist
- id: number;
- name: string;
- ownerId: string;
- thumbnail: string;
- description: string;
- dateOfCreation: Date;
- links: string;
- maxMembers: number;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Projects not found"

---

### `PUT /project`

Aktualisiert die Informationen eines Projekts.

**Parameter:**

- `id` (string): Die eindeutige ID des Projekts.
- `name` (string): Der neue Name des Projekts.
- `ownerId` (string): Die neue eindeutige ID des Projektbesitzers.
- `thumbnail` (string): Der neue Thumbnail-Link des Projekts.
- `description` (string): Die neue Beschreibung des Projekts.
- `links` (string[]): Die neuen Links zum Projekt.
- `maxMembers` (number): Die neue maximale Anzahl von Mitgliedern im Projekt.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Project updated"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project not updated"

---

### `DELETE /project`

Löscht ein Projekt.

**Parameter:**

- `userId` (string): Die eindeutige ID des Benutzers, der das Projekt löscht.
- `projectId` (string): Die eindeutige ID des zu löschenden Projekts.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Project deleted"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project not deleted"

---

### `POST /projectMember`

Fügt einen Benutzer als Mitglied zu einem Projekt hinzu.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.
- `userId` (string): Die eindeutige ID des Benutzers, der hinzugefügt werden soll.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Project member added"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project member not added"

---

### `GET /projectMembers`

Ruft alle Mitglieder eines Projekts ab.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Liste der Mitglieder des Projekts
- id: number;
- projectId: number;
- userId: string;
- IsAccepted: boolean;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project members not found"

---

### `GET /userIsMember`

Überprüft, ob ein Benutzer Mitglied in einem Projekt ist.

**Parameter:**

- `userId` (string): Die eindeutige ID des Benutzers.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Liste der Projekte, in denen der Benutzer Mitglied ist
- id: number;
- name: string;
- ownerId: string;
- thumbnail: string;
- description: string;
- dateOfCreation: Date;
- links: string;
- maxMembers: number;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Projects not found"

---

### `PUT /projectMember`

Aktualisiert den Status eines Mitglieds in einem Projekt.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.
- `userId` (string): Die eindeutige ID des Benutzers, dessen Status aktualisiert werden soll.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Project member updated"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project member not updated"

---

### `DELETE /projectMember`

Entfernt ein Mitglied aus einem Projekt.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.
- `userId` (string): Die eindeutige ID des zu entfernenden Benutzers.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Project member deleted"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project member not deleted"

---

### `POST /view`

Fügt eine Ansicht zu einem Projekt hinzu.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.
- `userId` (string): Die eindeutige ID des Benutzers, der das Projekt angesehen hat.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "View added"

**Fehlerantwort:**

- Statuscode: 400
- Body: "View not added"

---

### `GET /views`

Ruft alle Ansichten eines Projekts ab.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Liste der Ansichten des Projekts
- id: number;
- projectId: number;
- userId: string;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Views not found"

---

### `POST /like`

Fügt einem Projekt ein "Gefällt mir" hinzu.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.
- `userId` (string): Die eindeutige ID des Benutzers, der das Projekt mag.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Like added"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Like not added"

---

### `GET /likes`

Ruft alle "Gefällt mir" für ein Projekt ab.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Liste der "Gefällt mir" für das Projekt
- id: number;
- projectId: number;
- userId: string;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Likes not found"

---

### `DELETE /like`

Entfernt ein "Gefällt mir" von einem Projekt.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.
- `userId` (string): Die eindeutige ID des Benutzers, dessen "Gefällt mir" entfernt werden soll.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Like deleted"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Like not deleted"

---

### `POST /projectAbility`

Fügt einem Projekt eine Fähigkeit hinzu.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.
- `abilityId` (string): Die eindeutige ID der Fähigkeit, die hinzugefügt werden soll.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Project ability added"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project ability not added"

---

### `GET /projectAbilities`

Ruft alle Fähigkeiten eines Projekts ab.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: Liste der Fähigkeiten des Projekts
- id: number;
- projectId: number;
- abilityId: number;

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project abilities not found"

---

### `DELETE /projectAbility`

Entfernt eine Fähigkeit von einem Projekt.

**Parameter:**

- `projectId` (string): Die eindeutige ID des Projekts.
- `abilityId` (string): Die eindeutige ID der zu entfernenden Fähigkeit.

**Erfolgreiche Antwort:**

- Statuscode: 200
- Body: "Project ability deleted"

**Fehlerantwort:**

- Statuscode: 400
- Body: "Project ability not deleted"

---
