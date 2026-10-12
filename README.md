# elemental-monster-duel-ui

## 📌 Overview

**elemental-monster-duel-ui** is one of 6 repositories in the distributed
architecture of Elemental Monster Duel. It holds the frontend — a Vite +
React + TypeScript single-page app.

---

## 🎯 Purpose

This repository exists to:

- Give players a browsable, playable interface
- Stay a static site, deployable without a server of its own
- Keep presentation concerns separate from the rest of the project

---

## 🧱 Project Architecture Context

This repo is one of 6 in the Elemental Monster Duel ecosystem, each
independently versioned and maintained:

| Module | Responsibility | Repository |
|---|---|---|
| `db` | Database schema | https://github.com/D3vlin/elemental-monster-duel-db |
| `entity` | JPA mapping | https://github.com/D3vlin/elemental-monster-duel-entity |
| `dto` | Data transport | https://github.com/D3vlin/elemental-monster-duel-dto |
| `mapper` | Entity ↔ DTO | https://github.com/D3vlin/elemental-monster-duel-mapper |
| `api` | REST interface | https://github.com/D3vlin/elemental-monster-duel-api |
| `ui` | Frontend | — (this) |

---

## 🚀 Why a Dedicated UI Module?

- Ships and deploys on its own release cycle
- A static site, hosted for free, with no server of its own to operate
- The only module players interact with directly

---

## License

No license — all rights reserved.
