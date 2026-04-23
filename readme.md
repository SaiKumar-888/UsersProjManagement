DOC Link : https://docs.google.com/document/d/1oYp0HIflFmZCai0l1JkqaoBvEJxQUPiJgLlM1j4evbg/edit?tab=t.0

What they do:
express → backend framework
cors → allow frontend to call backend
helmet → security headers
dotenv → load .env variables


tsConfig
Why this config?
Important ones:
rootDir → source code will live inside src
outDir → compiled JS goes to dist
strict → safer code
NodeNext → modern Node + ES module support


What is Prisma?

Prisma is your bridge between Node.js and the database.

Instead of writing raw SQL everywhere like:

SELECT * FROM users;

you can write:

await prisma.user.findMany();

This is why Prisma is so popular in modern TS/Node apps.


What is Zod?

zod is a schema validation library.






