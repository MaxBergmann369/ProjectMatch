# Validierungsklassen

---

## Klasse `ValUser`

### Methoden

#### `static isValid(userId: string, username: string, firstname: string, lastname: string, email: string, clazz: string, birthdate: Date, biografie: string, permissions: number, department: string): boolean`

Überprüft, ob die Benutzerdaten gültig sind.

- **Parameter:**
 - **`userId`**:
  - Länge: genau 8 Zeichen
  - Muss mit einem gültigen Präfix beginnen, gefolgt von numerischen Zeichen
- **`username`**:
  - minLength: 4
  - maxLength: 20
  - Darf keine verbotenen Wörter enthalten
- **`firstname`**:
  - minLength: 1
  - maxLength: 20
  - Darf keine verbotenen Wörter enthalten
- **`lastname`**:
  - minLength: 1
  - maxLength: 20
  - Darf keine verbotenen Wörter enthalten
- **`email`**:
  - Muss einem gültigen E-Mail-Format entsprechen
- **`clazz`**:
  - minLength: 1
  - maxLength: 10
- **`birthdate`**:
  - Muss ein gültiges Datum sein
  - Darf nicht älter als 100 Jahre und nicht jünger als 10 Jahre sein
- **`biografie`**:
  - Keine spezifischen Validierungsregeln in der Methode `isValid`
- **`permissions`**:
  - Darf nicht negativ sein
- **`department`**:
  - Muss ein gültiger Wert aus `DepartmentTypes` sein

- **Rückgabewert:**
  - `boolean`: `true` wenn die Benutzerdaten gültig sind, sonst `false`.

#### `static async isUserValid(userId: string): Promise<boolean>`

Überprüft, ob die Benutzer-ID gültig und der Benutzer in der Datenbank vorhanden ist.

- **Parameter:**
  - `userId` (string): Die eindeutige ID des Benutzers.

- **Rückgabewert:**
  - `Promise<boolean>`: `true` wenn die Benutzer-ID gültig ist und der Benutzer existiert, sonst `false`.

### Private Methoden

#### `private static isUserIdValid(userId: string): boolean`

Überprüft, ob die Benutzer-ID gültig ist.

- **Parameter:**
  - `userId` (string): Die eindeutige ID des Benutzers.

- **Rückgabewert:**
  - `boolean`: `true` wenn die Benutzer-ID gültig ist, sonst `false`.

#### `private static isEmailValid(email: string): boolean`

Überprüft, ob die E-Mail-Adresse gültig ist.

- **Parameter:**
  - `email` (string): Die E-Mail-Adresse.

- **Rückgabewert:**
  - `boolean`: `true` wenn die E-Mail-Adresse gültig ist, sonst `false`.

#### `private static containsForbiddenWords(username: string, firstname: string, lastname: string): boolean`

Überprüft, ob die Eingabewerte verbotene Wörter enthalten.

- **Parameter:**
  - `username` (string): Der Benutzername.
  - `firstname` (string): Der Vorname.
  - `lastname` (string): Der Nachname.

- **Rückgabewert:**
  - `boolean`: `true` wenn verbotene Wörter enthalten sind, sonst `false`.

#### `private static validateBirthdate(birthdate: Date): boolean`

Überprüft, ob das Geburtsdatum gültig ist.

- **Parameter:**
  - `birthdate` (Date): Das Geburtsdatum.

- **Rückgabewert:**
  - `boolean`: `true` wenn das Geburtsdatum gültig ist, sonst `false`.

#### `private static validateDepartment(department: string): boolean`

Überprüft, ob die Abteilung gültig ist.

- **Parameter:**
  - `department` (string): Die Abteilung.

- **Rückgabewert:**
  - `boolean`: `true` wenn die Abteilung gültig ist, sonst `false`.

---

## Klasse `ValProject`

### Methoden

#### `static isValid(name: string, ownerId: string, thumbnail: string, description: string, dateOfCreation: Date, links: string, maxMembers: number): boolean`

Überprüft, ob die Projektdaten gültig sind.

- **Parameter:**
  
- **`name`**:
  - minLength: 1
  - maxLength: 30
- **`ownerId`**:
  - Muss eine gültige Benutzer-ID sein (Validierung durch `ValUser.isUserValid`)
- **`thumbnail`**:
  - minLength: 1
  - maxLength: 20
- **`description`**:
  - minLength: 1
  - maxLength: 1000
- **`dateOfCreation`**:
  - Muss ein gültiges Datum sein
  - Jahr muss zwischen 2000 und dem aktuellen Jahr liegen
- **`links`**:
  - minLength: 0
  - maxLength: 1000
- **`maxMembers`**:
  - min: 1
  - max: 10

- **Rückgabewert:**
  - `boolean`: `true` wenn die Projektdaten gültig sind, sonst `false`.

### Private Methoden

#### `private static validateDate(date: Date): boolean`

Überprüft, ob das Datum gültig ist.

- **Parameter:**
  - `date` (Date): Das Datum.

- **Rückgabewert:**
  - `boolean`: `true` wenn das Datum gültig ist, sonst `false`.

---

## Klasse `ValNotification`

### Methoden

#### `static isValid(userId: string, title: string, text: string): boolean`

Überprüft, ob die Benachrichtigungsdaten gültig sind.

- **Parameter:**
- **`userId`**:
  - Muss eine gültige Benutzer-ID sein (Validierung durch `ValUser.isUserIdValid`)
- **`title`**:
  - minLength: 1
  - maxLength: 50
- **`text`**:
  - minLength: 1
  - maxLength: 500

- **Rückgabewert:**
  - `boolean`: `true` wenn die Benachrichtigungsdaten gültig sind, sonst `false`.

---

## Klasse `ValMessage`

### Methoden

#### `static isValid(senderId: string, message: string): boolean`

Überprüft, ob die Nachrichtendaten gültig sind.

- **Parameter:**
- **`senderId`**:
  - Muss eine gültige Benutzer-ID sein (Validierung durch `ValUser.isUserIdValid`)
- **`message`**:
  - minLength: 1
  - maxLength: 500
  - Darf keine verbotenen Wörter enthalten

- **Rückgabewert:**
  - `boolean`: `true` wenn die Nachrichtendaten gültig sind, sonst `false`.

### Private Methoden

#### `private static containsForbiddenWords(message: string): boolean`

Überprüft, ob die Nachricht verbotene Wörter enthält.

- **Parameter:**
  - `message` (string): Die Nachricht.

- **Rückgabewert:**
  - `boolean`: `true` wenn verbotene Wörter enthalten sind, sonst `false`.

---

## Enums

### `DepartmentTypes`

- `Unset = "Unknown"`
- `AD = "Abendschule"`
- `BG = "Biomedizin- und Gesundheitstechnik"`
- `FE = "Fachschule Elektronik"`
- `HE = "Höhere Elektronik"`
- `IF = "Informatik"`
- `IT = "Medientechnik"`