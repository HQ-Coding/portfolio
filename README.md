# Personal Portfolio

A dynamic personal portfolio website built with **Next.js, TypeScript, Tailwind CSS, MongoDB Atlas, and Zod**. The project organizes portfolio content such as profile information, skills, education, experience, certificates, and projects.

## Tech Stack

- **Next.js 16** — React framework with the App Router
- **TypeScript** — Type-safe development
- **React** — User interface
- **Tailwind CSS 4** — Styling
- **MongoDB Atlas** — Cloud database for portfolio content
- **MongoDB Node.js Driver** — Database connectivity and queries
- **Zod** — Runtime validation of database documents
- **ESLint** — Code linting

## Features

- Dynamic portfolio content loaded from MongoDB
- Profile, skills, education, and experience data
- Certificates and projects organized by display order
- Published/unpublished filtering for certificates and projects
- Runtime validation of database documents using Zod
- Script for importing portfolio data into MongoDB
- TypeScript-based application structure

## Getting Started

### Prerequisites

Before running the project, install:

- [Node.js](https://nodejs.org/) (a version compatible with the installed Next.js release)
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account and database

### 1. Clone the repository

```bash
git clone https://github.com/HQ-Coding/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a file named `.env.local` in the project root, alongside `package.json`.

Add your own MongoDB connection details:

```env
MONGODB_URI="your_mongodb_connection_string"
MONGODB_DB="portfolio"
```

`MONGODB_URI` is required. `MONGODB_DB` is optional and defaults to `portfolio` if omitted.

Replace the placeholder connection string with your MongoDB Atlas connection string. Make sure your database user has the necessary permissions and your network access settings allow the connection.

**Security:** Never commit `.env.local`, database passwords, or other secrets to GitHub. Keep credentials in environment variables.

### 4. Import portfolio data

The repository includes a data import script and `portfolio-data.json`.

To import or synchronize the portfolio data with MongoDB, run:

```bash
npm run import:data
```

Run this command only after configuring the database connection. Review the import script before running it against an existing database.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run import:data` | Import portfolio data into MongoDB |

## Project Structure

```text
portfolio/
├── scripts/
│   └── import-portfolio.mjs
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── db-test/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── data.ts
│       ├── mongodb.ts
│       └── types.ts
├── portfolio-data.json
├── .env.local          # Local only; do not commit
├── package.json
└── README.md
```

## Database Collections

The application uses MongoDB collections for its portfolio content:

- `siteContent` — Main profile and portfolio information
- `certificates` — Certificate records
- `projects` — Project records

The main profile document uses `_id: "main"`. The application validates database documents with Zod before using them.

## Deployment

This project can be deployed to a platform that supports Next.js, such as [Vercel](https://vercel.com/).

For deployment:

1. Import the GitHub repository into your hosting provider.
2. Configure `MONGODB_URI` in the project's environment variables.
3. Set `MONGODB_DB` to `portfolio` if you want to use the default database name explicitly.
4. Ensure MongoDB Atlas allows connections from the deployment environment.
5. Deploy the application and verify that the portfolio content loads correctly.

Do not upload `.env.local` or expose database credentials in source code.

## Current Development Status

The portfolio application and MongoDB data integration are in development. Additional functionality, such as an admin panel, may be added in future updates.

## License

No license has been specified yet. All rights are reserved unless a license is added to this repository.
