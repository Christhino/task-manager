# Task Manager 


# Stack technique

## Backend

* Node.js
* TypeScript
* Hono (framework HTTP)
* SQLite (`better-sqlite3`)
* Zod (validation)
* Vitest (tests)

---

## Frontend

* React
* TypeScript
* Vite
* TanStack Query (gestion API)

---

# Structure du projet

```
task-manager/
├── apps/
│   ├── api/      # Backend Hono + SQLite
│   └── web/      # Frontend React + Vite
├── package.json  # Monorepo (npm workspaces)
```

---

# 🚀 Installation & démarrage

## 1. Cloner le projet

```bash
git clone https://github.com/Christhino/task-manager.git
cd task-manager
```

## 2. Installer les dépendances

```bash
npm install
```

## 3. Lancer le projet

```bash
npm run dev:api pour l'api
npm run dev:web pour  le frontend
```

Cela démarre :

* API → http://localhost:3000
* Frontend → http://localhost:5173

---

#  Backend – API

## Base URL

```
http://localhost:3000
```

---

## Endpoints

### ➤ Créer une tâche

```http
POST /tasks
```

### Body :

```json
{
  "title": "Ma tâche",
  "description": "Description optionnelle",
  "status": "todo",
  "dueDate": "2026-04-12T00:00:00.000Z"
}
```

---

### ➤ Récupérer la liste des tâches

```http
GET /tasks
```

### Query params :

| Paramètre | Description                 |
| --------- | --------------------------- |
| status    | Filtrer par statut          |
| search    | Recherche texte             |
| sortBy    | createdAt / dueDate / title |
| sortOrder | asc / desc                  |
| limit     | nombre d’éléments           |
| cursor    | pagination                  |

---

### Exemple :

```http
GET /tasks?status=todo&search=design&limit=10
```

---

### ➤ Pagination par cursor

Réponse :

```json
{
  "data": [...],
  "pageInfo": {
    "nextCursor": "abc123",
    "hasMore": true
  }
}
```

Utilisation :

```http
GET /tasks?cursor=abc123
```

---

### ➤ Récupérer une tâche

```http
GET /tasks/:id
```

---

### ➤ Modifier une tâche

```http
PUT /tasks/:id
```

---

### ➤ Supprimer une tâche

```http
DELETE /tasks/:id
```

---

# Gestion des erreurs

Format standard :

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": {}
  }
}
```

---

# Choix techniques

## Hono

Framework léger, rapide, avec une syntaxe claire, adapté à un prototype.

## SQLite

Base locale simple, sans setup, avec garanties ACID.

## Cursor Pagination

Pagination stable basée sur :

* `createdAt`
* `id`

Permet d’éviter les problèmes de skip/offset.

## Zod

Validation centralisée et typée, utilisée comme source de vérité.

## Monorepo

Utilisation de npm workspaces pour :

* simplifier l’installation
* gérer frontend et backend ensemble

---

# Frontend

Interface minimaliste permettant :

* afficher la liste des tâches
* créer / modifier / supprimer
* filtrer et rechercher
* pagination

---

# Tests

Lancer les tests backend :

```bash
npm run test --workspace=apps/api
```

---

# 👨‍💻 Auteur

Christhino Mintsaniaina
Fullstack Developer – JavaScript / TypeScript / Python

---
