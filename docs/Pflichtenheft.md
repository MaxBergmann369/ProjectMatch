# Pflichtenheft für ProjectMatch

## Ausgangslage
Als Schülerinnen und Schüler der HTL Leonding im Rahmen der Unterrichtsfächer "Webentwicklung und Mobile Computing" sowie "Systemplanung und Projektentwicklung" ist es oft herausfordernd, Projektpartnerinnen oder Projektpartner zu finden. Sowohl für schulische Diplomarbeiten als auch für Projekte außerhalb des Unterrichts gibt es keine zentrale Plattform zur Projektfindung.

## Zielsetzung
Das Ziel dieses Projektes ist die Entwicklung einer webbasierten Plattform namens ProjectMatch, die es Schülerinnen und Schülern ermöglicht, interessante Projekte zu entdecken, Projektmitarbeitende zu finden und eine effiziente Projektkommunikation zu gewährleisten. Die Plattform soll bis zum Ende des Semesters voll funktionsfähig sein und folgende Hauptziele erfüllen:

1. Bereitstellung einer Plattform zur Darstellung verfügbarer Projekte mit ihren Anforderungen, dem Umfang.
2. Bereitstellung einer Plattform zur Darstellung von Interessenten mit ihren Fähigkeiten.

## Anforderungen (Soll)

### Anforderungen an die Applikationssoftware
- **Usability:**
  Die Plattform muss eine hohe Benutzerfreundlichkeit bieten und optimal auf mobilen und Desktop-Browsern dargestellt werden.
- **Datenschutz und Datensicherheit:**
  - Verwendung von HTTPS für eine sichere Datenübertragung.
  - Verschlüsselung von Passwörtern und persönlichen Daten.
  - Eindeutige Identifizierung von Teilnehmenden durch E-Mail.

### Anforderungen an die Systemplattform
- **Datenbanksystem:**
  Einrichtung einer Datenbank zur Speicherung von Projektdaten, Projektteilnehmerdaten.
- **Backend / Server:**
  Verwendung eines NodeJS Express Servers zur Verarbeitung von Anfragen und Bereitstellung von Daten.
- **Frontend:**
  Implementierung des Frontends mit HTML, CSS und Typescript für eine ansprechende Benutzeroberfläche.

## Mengengerüst
- Annahme von maximal 50 Benutzerinnen und Benutzern gleichzeitig auf der Plattform.
- Datenbewegungen durch Upload von Projektbeispielen (maximal 20 MB pro Bild), sowie Daten zu Projektteilnehmern und Projekten.
- Die Datenbank muss Projektdaten, Projektteilnehmerdaten verwalten können.

## Administratives
**Verantwortliche für das Pflichtenheft:**
- Adam Höllerl
- Max Bergmann
- Alin Jasic
