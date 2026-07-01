# Mixology — Der Premium Cocktail Guide (Anwendungsdokumentation)

## 1. Übersicht und Leitgedanke
Die Anwendung **Mixology** ist eine als **Progressive Web App (PWA)** konzipierte, hochgradig interaktive und visuell anspruchsvolle Plattform für Cocktail-Enthusiasten. Das primäre Ziel der Anwendung ist es, **100 klassische und populäre Cocktailrezepte** über eine **nahtlose, native App-ähnliche Benutzeroberfläche** zugänglich zu machen. Die Applikation zeichnet sich durch eine **maßgeschneiderte SVG-Vektorgrafik-Engine** aus, welche die Drinks dynamisch und animiert im jeweiligen Originalglas visuell darstellt.

---

## 2. Design-Philosophie, UI & UX
Das Design-Konzept der Anwendung verfolgt einen **Premium-Ansatz**, der Exklusivität und Eleganz mit intuitiver Bedienbarkeit kombiniert. Die gesamte User Experience (UX) ist auf **Flüssigkeit, haptisches Feedback und visuelle Tiefe** optimiert.

### 2.1 Typografie und Farbwelten
* **Typografie:** Es wird die Serifenschrift **„Cinzel“** für Überschriften genutzt, um eine luxuriöse und zeitlose Ästhetik zu erzeugen. Für Fließtexte und die Benutzeroberfläche kommt **„Inter“** zum Einsatz, um höchste Lesbarkeit zu gewährleisten.
* **Themen-Modi (Themes):** Die Anwendung unterstützt einen vollständig durchdachten **Dark Mode** (Standard) und **Light Mode**.
  * **Dark Mode (Charcoal Dark & Gold):** Nutzt tiefe Grautöne (`#0A0A0B`), akzentuiert durch ein eigens definiertes, metallisches **Premium-Gold-Gradient** und weiche Schatten (`rgba(0, 0, 0, 0.6)`).
  * **Light Mode (Warm Ivory & Deep Sienna):** Basiert auf warmen Elfenbeintönen (`#F5EFE6`) gepaart mit tiefem Sienna-Braun und kupferfarbenen Akzenten, um einen hohen Kontrast bei Tageslicht zu garantieren.
* **Glas-Effekte:** Der Header nutzt **Backdrop-Blur-Effekte** (`backdrop-filter: blur(20px)`), wodurch durchscrollende Inhalte elegant durch die Menüleiste schimmern (Glassmorphismus).

### 2.2 Spezifischer Nutzwert & Mikrointeraktionen
* **Dynamische Farbanpassung:** Die Theme-Farbe der Statusleiste auf Mobilgeräten (`<meta name="theme-color">`) passt sich in Echtzeit an den gewählten Modus an.
* **Cubic-Bezier Animationen:** Sämtliche Übergänge (Karten-Hover, Ansichtswechsel) nutzen **maßgeschneiderte Sprung-Animationen** (`cubic-bezier(0.34, 1.56, 0.64, 1)`), die der App ein physisch greifbares und reaktionsschnelles Gefühl verleihen.
* **PWA-Optimierungen (Full-Screen iOS):** Eine spezielle CSS-Regel (`height: -webkit-fill-available;`) behebt das bekannte iOS-Problem des weißen Balkens am unteren Bildschirmrand und sorgt für eine **vollständige Edge-to-Edge-Darstellung**.

---

## 3. Architektur und Kernfunktionen (Übersicht)

Die Anwendung ist als **Single Page Application (SPA)** aufgebaut und in **vier logische Hauptansichten (Views)** unterteilt. Ein speziell entwickeltes Routing-System verarbeitet die Navigation über Hash-Werte (`#explore`, `#search`, `#bar`, `#favorites`), ohne die Seite neu zu laden.

| **Ansicht (View)** | **Kernfunktion** | **Besondere Merkmale** |
| :--- | :--- | :--- |
| **Entdecken (Explore)** | Startseite zur Inspiration und Kategorienübersicht. | **Tageszeitabhängige Begrüßung**, **Cocktail des Tages**-Hero-Karte, horizontales Scrollen für Kategorien. |
| **Suche (Search)** | Volltextsuche und Filterung von Cocktails. | Filter-Pills (z.B. **Geschüttelt**, **Gerührt**), Suchfeld mit Live-Aktualisierung und Empty-States. |
| **Bar-Schrank (Bar)** | Verwaltung des eigenen Inventars und Rezeptabgleich. | **Automatisches Gruppieren** von Zutaten, dynamische Berechnung **100% mixbarer** und **fast mixbarer** Cocktails. |
| **Favoriten (Favorites)** | Lokale Speicherung persönlicher Lieblingsdrinks. | Lückenlose Synchronisation via **LocalStorage**, direkte Integration in alle Ansichten über Herz-Icons. |

---

## 4. Detaillierte Funktionsbeschreibung bis in die Tiefe

### 4.1 Entdecken-Ansicht (Explore)
Die Startseite dient als primärer Einstiegspunkt und präsentiert dem Nutzer eine dynamische und strukturierte Übersicht.
* **Intelligente Begrüßung:** Das System analysiert die lokale Systemzeit des Nutzers und passt den Begrüßungstext dynamisch an (z. B. **„Guten Morgen“** vor 11 Uhr, **„Guten Abend“** ab 18 Uhr).
* **Hero-Karte „Cocktail des Tages“:** Jeden Tag wird ein anderer Drink anhand eines **tagesdatumbasierten Hash-Algorithmus** aus der Datenbank ausgewählt. Die Karte visualisiert das Glas, die Füllmenge in Millilitern, die Kategorie und bietet einen dedizierten **„Aktualisieren“-Button** für den manuellen Wechsel.
* **Kategorien & Top-Klassiker:** Horizontale Scrollbereiche (mit `scroll-snap-type` für natives Swipe-Verhalten) präsentieren Filter-Kategorien (mit spezifischen Emojis, wie 🌿 für Gin) und die **Top 10 Klassiker** basierend auf ihrem internen Rang.
* **Vollständige Rasteransicht:** Im unteren Bereich werden alle 100 Cocktails in einem responsiven Grid-System dargestellt. Das Raster passt sich fließend von zwei Spalten auf Mobilgeräten bis zu vielen Spalten auf Widescreen-Monitoren an.

### 4.2 Die Rezept-Detail-Ansicht (Pull-up Drawer)
Anstatt den Nutzer auf eine neue Seite zu leiten, öffnet sich jedes Rezept in einem **interaktiven Overlay-Drawer**, der von unten in den Bildschirm gleitet.
* **UX/Gesten-Steuerung:** Der Drawer verfügt über einen visuellen Indikator (Handle) und simuliert das Verhalten einer echten nativen Smartphone-App.
* **Kopfzeile & Interaktion:** Im oberen Bereich befinden sich Schaltflächen für **Favorisieren (Herz)** und **Teilen**. Die Teilen-Funktion nutzt die native **Web Share API** des Betriebssystems, um eine textbasierte Einkaufsliste der Zutaten an andere Apps zu übergeben.
* **Dynamische SVG-Vektor-Glaswaren:** Dies ist das absolute Herzstück. Eine Matrix von **16 detailliert kartierten Gläsern** (z.B. Martiniglas, Hurricaneglas, Tiki-Becher) wird via JavaScript gezeichnet.
  * **Algorithmus der Flüssigkeiten:** Jede Zutat wird analysiert. Basierend auf ihrem Namen (z.B. „Aperol“, „Minze“, „Kaffee“) wird eine **spezifische Farbkodierung und Transparenz** zugeordnet.
  * **Animations-Logik:** Die Flüssigkeitsschichten werden beim Öffnen des Drawers durch einen CSS-Übergang über `setTimeout` animiert „eingefüllt“.
  * **Visuelle Finessen:** Abhängig von der Rezeptur generiert das System **Eiswürfel** (Standard oder Crushed Ice), Strohhalme, **Garnituren** (Orangenzesten, Oliven, Cocktailschirmchen) und simuliert sogar das Sprudeln von Kohlensäure (`<circle class="sparkle">`), falls sprudelnde Zutaten wie Soda oder Champagner enthalten sind.
* **Abhakbare Zubereitungsschritte:** Die Anleitungstexte werden am Satzende getrennt. Jeder Einzelschritt wird als antippbare Karte gerendert, die sich nach Erledigung ausgraut (**Streich-Effekt**).

### 4.3 Such- und Filterlogik
* Die Suchansicht vereint eine **Live-Textsuche** mit einer **Pill-basierten Filterung**.
* Es wird nicht nur der Name des Cocktails durchsucht, sondern auch die **Kategorie**, das verwendete **Glas** und der hinterlegte `search_text` (eine Zusammenfassung aller Zutaten).
* Die Filter erlauben es, gezielt nach der Zubereitungsart (**Shaken, Build, Stir**) oder nach dem Alkoholgehalt zu filtern. Ist kein Treffer vorhanden, erscheint ein **elegantes Empty-State-Design** mit aufmunterndem Text.

### 4.4 Mein Bar-Schrank (Inventar-System)
* **Zutaten-Extraktion:** Beim Laden der App liest der Algorithmus alle über 180 Zutaten aus den 100 Cocktails ein. Irrelevante Garnituren werden clever gefiltert.
* **Auto-Kategorisierung:** Ein regelbasiertes System analysiert die Zutaten anhand von Schlüsselwörtern und sortiert sie in die Kategorien **Spirituosen & Liköre**, **Fruchtsäfte & Sirupe**, **Filler & Mixer** und **Kräuter, Obst & Sonstiges**.
* **Echtzeit-Inventarabgleich:** Wählt der Nutzer seine vorhandenen Zutaten aus (mit persistenter Speicherung im `LocalStorage`), berechnet die App sofort zwei Listen:
  1. **Sofort mixbar (100% passend):** Der Nutzer hat alle nicht-optionalen Hauptzutaten im Schrank.
  2. **Fast bereit:** Es fehlt exakt **eine einzige Zutat**. Die fehlende Zutat wird prominent auf der Cocktailkarte als roter Text („Fehlt: ...“) eingeblendet.

### 4.5 Progressive Web App (PWA) Architektur
Die Anwendung verlässt sich nicht nur auf die Browser-Engine, sondern bietet ein natives Erlebnis:
* **Service Worker (`sw.js`):** Ein Service Worker fängt alle Netzwerk-Requests ab. Die gesamten App-Ressourcen (CSS, JS, JSON-Daten, Icons) werden im `CacheStorage` unter `mixology-v8` abgelegt. Dadurch ist die Applikation nach dem ersten Ladevorgang **komplett offline-fähig**.
* **Manifest (`manifest.json`):** Definiert Icons für alle Plattformen, die Hintergrundfarbe, und erzwingt das Öffnen als eigenständige App (`"display": "standalone"`).
* **iOS Install Banner:** Da iOS PWAs nicht so offensiv bewirbt wie Android, ist eine maßgeschneiderte Erkennung implementiert, die iOS-Nutzern im Browser ein elegantes Installationsbanner zeigt, um die App zum Home-Bildschirm hinzuzufügen.

---

## 5. Datenstruktur (`cocktails.json`)
Die Rezeptdatenbank ist ein JSON-Dokument, welches streng normalisiert ist und alle notwendigen Meta-Informationen liefert:
* **Struktur eines Rezepts:** Jedes Objekt enthält eindeutige IDs (`porn-star-martini`), den Rang, Kategorien, und `servings`.
* **Zutaten (`ingredients`):** Präzise aufgeschlüsselt nach **Rolle** (`ingredient`, `garnish`, `side_serving`), **Menge** (inkl. numerischen Werten für Berechnungen) und **Einheit** (`ml`, `Dashes`, `Blätter`). Ein Flag (`optional: true/false`) teilt dem Bar-Schrank-Modul mit, ob das Rezept an dieser Zutat scheitern darf.
* **Metadaten:** `total_volume` kalkuliert die ungefähre Füllmenge im Glas (inklusive berechneter Wasserverdünnung (`Dilution`) durch das Schütteln oder Rühren mit Eis). Das Feld `method_tags` steuert die Filter und UI-Hinweise.

---

## 6. Zusammenfassung

Der **Mixology Premium Cocktail Guide** stellt den perfekten Hybriden aus einer hochstrukturierten Datenbank und einer visuell brillanten Benutzeroberfläche dar. Jedes noch so kleine Element – vom **mathematisch berechneten SVG-Winkel des Martiniglases** über die **dynamischen Bläschen-Animationen** bei kohlensäurehaltigen Drinks bis hin zur **persistierenden Inventar-Logik** des Bar-Schranks – wurde mit größter Präzision entwickelt. Es ist nicht einfach nur eine Rezeptsammlung, sondern eine **technisch ausgefeilte, offline-fähige und immersive Bar-Assistenz-Erfahrung**, die keine qualitativen Wünsche offenlässt.
