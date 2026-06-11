# AutoAssist 3D

Platformă web modernă pentru piese auto, service-uri, programări, chat, media și asistență rutieră.

## Arhitectură

- Frontend: React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, Leaflet.
- Backend: Java 21, Spring Boot, Spring Cloud Gateway, Spring Security, JPA, Flyway.
- Infrastructură: PostgreSQL, MinIO, Keycloak și Nginx în Docker Compose.
- Procese backend: microservicii locale administrate de PM2 prin `java -jar`.
- Sistem țintă: Linux.

## Cerințe Linux

- Java 21
- Maven 3.9+
- Node.js 20+
- npm
- Docker Engine
- Docker Compose v2
- PM2, instalat automat de script dacă lipsește

## Instalare

```bash
chmod +x scripts/*.sh
./scripts/install.sh
```

Pe Ubuntu, scriptul instalează automat dependențele lipsă:

- Java 21;
- Apache Maven 3.9+;
- Node.js 24 LTS și npm;
- Docker Engine și Docker Compose plugin;
- PM2;
- dependențele frontend.

Versiunile compatibile deja instalate sunt păstrate. Scriptul creează și fișierele
`.env` fără a suprascrie configurațiile existente.

Dacă utilizatorul este adăugat pentru prima dată în grupul `docker`, este necesară
o delogare și autentificare nouă înainte de `./scripts/start-all.sh`.

## Pornire completă

```bash
./scripts/start-all.sh
```

Ordinea automată este:

1. creare `.env`;
2. pornire PostgreSQL, MinIO, Keycloak și Nginx;
3. build Maven;
4. pornire microservicii cu PM2;
5. build React;
6. publicare build în volumul Nginx.

## Oprire și status

```bash
./scripts/stop-all.sh
./scripts/status.sh
```

## Reluare după o pornire întreruptă

Dacă infrastructura Docker este deja pornită, actualizați proiectul și rulați din nou
scriptul complet. Operația este idempotentă:

```bash
cd ProiectMultimedia
git pull
./scripts/start-all.sh
```

Verificare:

```bash
docker ps
pm2 status
./scripts/status.sh
```

Nu folosiți `pm2 list all`; comanda corectă este `pm2 status`.

## URL-uri

- Frontend Nginx: http://localhost
- API Gateway: http://localhost:8088
- Keycloak: http://localhost:8080
- MinIO Console: http://localhost:9001
- PostgreSQL: `localhost:5432`
- Swagger per serviciu: `http://localhost:809X/swagger-ui/index.html`

## Conturi implicite

Realm-ul `autoassist` este importat automat la prima pornire Keycloak.

| Rol | Utilizator | Parolă |
|---|---|---|
| USER | `user` | `user` |
| MECHANIC | `mecanic` | `mecanic` |

Administratorul consolei Keycloak este `admin/admin`.

Clientul frontend este `autoassist-web`, de tip public, cu PKCE.

> Conturile și parolele implicite sunt doar pentru dezvoltare. Schimbați-le înaintea unei instalări expuse în rețea.

## Testare manuală

1. Deschideți http://localhost și autentificați-vă cu `user/user`.
2. Verificați dashboard-ul USER, configuratorul și modelul 3D.
3. Deschideți harta de service-uri și creați o programare.
4. Testați chat-ul și upload-ul media.
5. Verificați obiectele în MinIO Console.
6. Deconectați-vă și autentificați-vă cu `mecanic/mecanic`.
7. Verificați inventarul, calendarul și cererile de asistență.

## Dezvoltare frontend

```bash
cd frontend
npm install
npm run dev
```

Vite rulează pe http://localhost:5173 și proxifică `/api` către API Gateway.

## Model GLB

Aplicația folosește implicit un model auto procedural. Un model real poate fi pus la:

`frontend/public/models/car.glb`

Convențiile nodurilor sunt documentate în `frontend/public/models/README.md`.

## Configurație

Fișierele reale sunt create în `config/env/` din fișierele `.env.example`. Scriptul `create-env.sh` nu suprascrie fișiere existente.

PM2 folosește `pm2/ecosystem.config.js`, iar logurile sunt scrise în `logs/pm2/`.
