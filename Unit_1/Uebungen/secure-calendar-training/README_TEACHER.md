# README – Lehrperson (nicht für Studierende)

> Diese Datei enthält Hintergrundinformationen zur Übung und ist ausschliesslich für die Lehrperson bestimmt.

---

## Übersicht der eingebauten vulnerablen Packages

| Package | Version | Bekannte Schwachstelle(n) | Severity | Fix-Version |
|---|---|---|---|---|
| `lodash` | 4.17.19 | Prototype Pollution (`merge`, `zipObjectDeep`, `defaultsDeep`) | High | 4.17.21 |
| `moment` | 2.29.1 | Path Traversal in Locale-Laden (CVE-2022-24785 / GHSA-8hfj-j24r-96c4) | High | 2.29.2 |
| `axios` | 0.21.1 | Server-Side Request Forgery, ReDoS (mehrere Advisories) | Moderate–High | 1.x |
| `nanoid` | 3.1.25 | Verwendung von `Math.random()` statt `crypto` (GHSA-qrpm-p2h7-hrv2) | Moderate | 3.1.31+ |

> **Hinweis:** Die genauen Resultate von `npm audit` ändern sich mit der Zeit, da das npm Advisory
> Database laufend aktualisiert wird. Neue Advisories können hinzukommen oder bestehende können
> überarbeitet werden. Ergebnisse aus dem Schuljahr können von späteren Durchführungen abweichen.

---

## Warum diese Packages?

### lodash@4.17.19
- Sehr weit verbreitetes Utility-Package (wird in fast jedem Projekt verwendet)
- Prototype-Pollution-Schwachstelle ist ein klassisches und gut dokumentiertes Beispiel
- Gut recherchierbar: CVE-Einträge, GitHub Advisories und npm Advisory vorhanden
- Fix ist trivial: `npm install lodash@latest`
- Zeigt, dass auch "harmlose" Hilfsbibliotheken sicherheitsrelevant sein können

### moment@2.29.1
- Sehr bekannte Datumsformatierungs-Bibliothek mit klarer CVE-Nummer (CVE-2022-24785)
- Path-Traversal-Schwachstelle beim Laden von Locale-Dateien
- Gut dokumentiert: patch notes auf GitHub vorhanden
- Lehrreich: zeigt, dass auch etablierte und populäre Libraries betroffen sein können
- moment.js ist ausserdem offiziell "legacy" – guter Anlass für eine Diskussion über
  Bibliotheks-Wartbarkeit und Ablösung durch modernere Alternativen (z. B. `date-fns`, `dayjs`)

### axios@0.21.1
- Sehr bekanntes HTTP-Client-Package
- Ältere 0.x-Versionen haben mehrere bekannte Advisories
- Zeigt transitive Sicherheitsrisiken: viele transitive Dependencies von axios können ebenfalls
  Findings auslösen
- Guter Diskussionspunkt: Unterschied zwischen einer Schwachstelle im Browser vs. Node.js

### nanoid@3.1.25
- Kleines, häufig genutztes Package zur ID-Generierung
- Verwendet unter bestimmten Bedingungen `Math.random()` statt kryptografisch sicheres `crypto`
- Gutes Beispiel für eine "moderate" Schwachstelle, die im Kontext dieser App kaum relevant ist
- Lehrreich für die Diskussion: "Ist jede Schwachstelle gleichermassen kritisch?"

---

## Erwartete Beobachtungen bei `npm ls --all`

Die Studierenden sollen sehen:

- **Direkte Dependencies** (erste Ebene): `axios`, `lodash`, `moment`, `nanoid`, `react`, `react-dom`
- **Transitive Dependencies**: alle Packages, die von diesen direkt gezogen werden (z. B. `follow-redirects` von `axios`, diverse React-interne Packages)
- `deduped`-Einträge zeigen, dass npm gleiche Packages nur einmal installiert
- Die Tiefe des Trees verdeutlicht, dass eine kleine `package.json` viele indirekte Abhängigkeiten mitbringt

---

## Erwartete Beobachtungen bei `npm audit`

Je nach aktuellem Stand der npm Advisory Database können folgende Findings erscheinen:

```
lodash  <=4.17.20
  Severity: high
  Prototype Pollution in lodash - https://github.com/advisories/GHSA-p6mc-m468-83gw
  ...

moment  <2.29.2
  Severity: high
  Path Traversal: 'moment().format()' leads to ReDos... - https://github.com/advisories/GHSA-8hfj-j24r-96c4
  ...

nanoid  <3.1.31
  Severity: moderate
  nanoid may generate non-unique IDs - https://github.com/advisories/GHSA-qrpm-p2h7-hrv2
  ...
```

Hinweis: Anzahl und Wortlaut der Findings können variieren. Wichtig ist das **Prinzip**, nicht die
exakten Texte.

---

## Mögliche Lösungsschritte für die Studierenden

### Option 1: Automatischer Fix

```bash
npm audit fix
```

Behebt in der Regel alle Findings ohne Breaking Changes. Bei Major-Version-Updates:

```bash
npm audit fix --force
```

> Achtung: `--force` kann Breaking Changes einführen. Danach `npm run build` testen.

### Option 2: Manuelles Update einzelner Packages

```bash
npm install lodash@latest
npm install moment@latest
npm install axios@latest
npm install nanoid@latest
```

Dann verifizieren:

```bash
npm run build
npm audit
```

### Option 3: moment ablösen

Für fortgeschrittene Studierende: moment ersetzen durch eine moderne Alternative:

```bash
npm uninstall moment
npm install dayjs@latest
```

Code-Anpassung in `App.tsx` nötig.

---

## Hinweis zur Änderung der Audit-Resultate

`npm audit` liefert keine statischen Resultate. Das npm Advisory Database-Inhalt wird laufend:

- ergänzt (neue Advisories für neue Schwachstellen)
- aktualisiert (genauere Versionsangaben)
- korrigiert (Fehlkorrekturen)

**Empfehlung:** Vor der Durchführung der Übung selbst einmal `npm audit` ausführen und die Resultate
prüfen. Falls ein Package keine Warnung mehr auslöst (weil z. B. eine neue Advisory noch nicht
publiziert ist oder eine alte zurückgezogen wurde), kann die Version entsprechend angepasst werden.

---

## Vorschlag für Bewertungskriterien

| Kriterium | Punkte |
|---|---|
| Dependency Tree korrekt erstellt und ausgewertet (`npm ls --all`) | 10 |
| Direkte und transitive Dependencies korrekt unterschieden | 10 |
| Sicherheitsprobleme korrekt identifiziert (`npm audit`) | 15 |
| Informationsquelle (CVE / GHSA) nachvollziehbar geprüft und beschrieben | 15 |
| Relevanz der Findings für die App sauber begründet | 20 |
| Update oder Fix korrekt durchgeführt | 15 |
| App nach dem Fix noch lauffähig (`npm run build` erfolgreich) | 10 |
| Ergebnisse vollständig in der Tabelle dokumentiert | 5 |
| **Total** | **100** |

---

## Lernziele für die Lehrperson – Erwarteter Diskussionsbedarf

- **Relevanz vs. Severity:** Hohe Severity bedeutet nicht automatisch hohe Relevanz für eine
  spezifische App. Gutes Beispiel: Path-Traversal in moment betrifft Locale-Dateien – in dieser
  App wird keine externe Locale-Eingabe verarbeitet.
- **Transitive Dependencies:** Viele Findings kommen aus Packages, die man nicht direkt eingebunden hat.
- **Supply-Chain-Sicherheit:** Die Übung bereitet auf das Verständnis vor, dass jede Dependency eine
  Angriffsfläche darstellt.
- **Fix vs. Ablösung:** Für moment gibt es gute Alternativen. Die Diskussion lohnt sich.
- **moment.js ist deprecated:** Guter Anlass, um über Lifecycle von Open-Source-Libraries zu sprechen.
