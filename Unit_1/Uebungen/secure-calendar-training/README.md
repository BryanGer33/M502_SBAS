# Übung: Dependency Security Analyse

> **Hinweis:** Diese App ist ausschliesslich für Schulungszwecke erstellt und enthält bewusst veraltete
> npm-Packages. Sie darf nicht produktiv eingesetzt werden.

---

## Ausgangslage

Ihr erhaltet eine kleine React-TypeScript-Kalender-App namens **secure-calendar-training**.

Die App funktioniert fachlich korrekt, enthält aber bewusst veraltete npm-Packages mit bekannten
Sicherheitsproblemen. Eure Aufgabe ist es, diese Probleme zu finden, zu verstehen, zu bewerten und
zu beheben.

---

## Lernziele

Nach der Übung können die Studierenden:

- direkte und transitive Dependencies anzeigen
- Sicherheitswarnungen mit `npm audit` erkennen
- herausfinden, welches Package betroffen ist
- nachvollziehen, woher die Sicherheitsinformation stammt
- die Relevanz der Schwachstelle für die Applikation einschätzen
- passende Updates durchführen
- prüfen, ob die Probleme nach dem Fix behoben wurden

---

## Teil 1: Projekt starten

Wechselt in das Projektverzeichnis und installiert die Abhängigkeiten:

```bash
npm install
npm run dev
```

Öffnet die angezeigte URL (z. B. `http://localhost:5173`) im Browser und überprüft, dass die App läuft.

**Fragen:**

- Welche Ausgabe erscheint im Terminal nach `npm install`?
- Gibt es bereits beim Install Hinweise auf Sicherheitsprobleme?

---

## Teil 2: Dependency Tree anzeigen

### Aufgabe

Zeigt den vollständigen Dependency Tree an.

```bash
npm ls --all
```

Alternativ nur eine Ebene tief:

```bash
npm ls
```

### Zusatzfragen

- Welche Packages sind **direkte** Dependencies (in `dependencies` bzw. `devDependencies` in `package.json`)?
- Welche Packages sind **transitive** Dependencies (werden von anderen Packages gezogen)?
- Was bedeutet der Hinweis `deduped`?
- Warum können auch transitive Dependencies ein Sicherheitsproblem darstellen, obwohl ihr sie nicht
  selbst eingebunden habt?

---

## Teil 3: Sicherheitsprobleme finden

### Aufgabe

Führt eine Sicherheitsanalyse der npm-Packages durch:

```bash
npm audit
```

Oder als JSON-Ausgabe für eine spätere Auswertung:

```bash
npm audit --json > audit-result.json
```

Den `npm audit`-Befehl könnt ihr auch über das vordefinierte Script ausführen:

```bash
npm run audit
```

### Fragen

- Welche Packages haben Sicherheitsprobleme?
- Handelt es sich um **direkte** oder **transitive** Dependencies?
- Welche **Severity**-Stufen werden angezeigt? (`critical`, `high`, `moderate`, `low`)
- Welche Advisory-Informationen (CVE, GHSA) werden pro Finding aufgeführt?
- Gibt es empfohlene Fixes in der Ausgabe?

---

## Teil 4: Quelle und Glaubwürdigkeit bewerten

### Aufgabe

Wählt **mindestens zwei** gefundene Sicherheitsmeldungen aus und bewertet die Informationsquelle.

Hinweise:

- CVE-Nummern findet ihr unter [https://nvd.nist.gov](https://nvd.nist.gov)
- GHSA-Nummern findet ihr unter [https://github.com/advisories](https://github.com/advisories)
- npm-Advisories findet ihr unter [https://www.npmjs.com/advisories](https://www.npmjs.com/advisories)

### Fragen

- Woher stammt die Information (npm Advisory, GitHub Advisory, CVE)?
- Gibt es technische Details zur Schwachstelle?
- Welche **betroffenen Versionen** werden genannt?
- Welche **korrigierte Version** wird empfohlen?
- Ist die Quelle glaubwürdig? Begründet eure Einschätzung.

---

## Teil 5: Relevanz für die Kalender-App bewerten

### Aufgabe

Bewertet, ob die gefundenen Probleme für **diese** App relevant sind.

Berücksichtigt dabei:

- Wird das betroffene Package im Code der App aktiv verwendet?
- Wird die konkret betroffene Funktion oder API verwendet?
- Läuft das Package im **Browser**, im **Build-Prozess** oder serverseitig?
- Ist die betroffene Funktion von aussen erreichbar (z. B. über eine öffentliche API)?
- Welche Daten könnten bei einer Ausnutzung betroffen sein?

### Relevanz-Einstufung

Stuft jedes Finding ein:

| Stufe | Bedeutung |
|---|---|
| **hoch** | Die Schwachstelle ist aktiv im Einsatz und potenziell ausnutzbar |
| **mittel** | Schwachstelle ist vorhanden, aber schwer ausnutzbar |
| **niedrig** | Theoretisch vorhanden, kaum realistisch ausnutzbar |
| **nicht relevant** | Package wird nicht oder nicht in der betroffenen Weise verwendet |
| **unklar** | Nicht genug Informationen für eine Einschätzung |

---

## Teil 6: Probleme beheben

### Aufgabe

Behebt die gefundenen Dependency-Probleme.

Automatischer Fix-Versuch:

```bash
npm audit fix
```

Falls `npm audit fix` nicht alle Probleme behebt (z. B. bei Breaking Changes), manuell aktualisieren:

```bash
npm install paketname@latest
```

Beispiele:

```bash
npm install moment@latest
npm install lodash@latest
npm install axios@latest
npm install nanoid@latest
```

> **Wichtig:** Die App muss nach dem Update weiterhin korrekt funktionieren.

Nach dem Fix ausführen:

```bash
npm install
npm run build
npm run audit
```

**Ziel:** `npm audit` soll keine kritischen (`critical`) oder hohen (`high`) Findings mehr anzeigen.

---

## Teil 7: Dokumentation

Erstellt eine kurze Dokumentation eurer Analyse mit folgender Tabelle.
Verwendet dafür die Vorlage in `docs/security-analysis-template.md`.

| Package | Direkt / Transitiv | Problem | Quelle | Severity | Relevanz | Massnahme | Ergebnis |
|---|---|---|---|---|---|---|---|
| z. B. lodash | Direkt | Prototype Pollution | GHSA-xxx | High | mittel | Update auf 4.17.21 | behoben |

---

## Abgabe

Gebt folgendes ab:

1. Screenshot oder Textauszug von `npm ls --all`
2. Screenshot oder Textauszug von `npm audit` (vor dem Fix)
3. Ausgefüllte Bewertungstabelle (`docs/security-analysis-template.md`)
4. Kurze Begründung zur Relevanz der Findings für diese App
5. Beschreibung der durchgeführten Fixes (oder Commit-History)
6. Erneuter `npm audit`-Nachweis **nach** der Behebung
