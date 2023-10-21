# PlanFlow3D

PlanFlow3D is a user-friendly 3D home design application that empowers users to quickly and efficiently design and visualize interior spaces.

## Built with:

- [Next.js](https://nextjs.org/): A React framework that enables features like server-side rendering and static site generation.
- [Three.js](https://threejs.org/): A cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapidly building custom user interfaces.
- [Prisma](https://www.prisma.io/): An open-source database toolkit and ORM for Node.js and TypeScript.
- [Mongodb](https://www.mongodb.com/) 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Install the database tool [Prisma.io](https://www.prisma.io/docs/concepts/components/prisma-schema)
If you make changes to the database, use this command:
```
npx prisma generate
```

If MongoDB isn't working, please ensure it's turned on:
```
brew install mongodb-community@7.0
```
To check MongoDB version:
```
mongod --version
```

file path:
```
/usr/local/var/log/mongodb/mongo.log
``` 
Configuration:
```
systemLog:
  destination: file
  path: /usr/local/var/log/mongodb/mongo.log
  logAppend: true
storage:
  dbPath: /usr/local/var/mongodb
net:
  bindIp: 127.0.0.1, ::1
  ipv6: true
replication:
  replSetName: "myReplSetName"
```
To ensure MongoDB is functioning properly, use the following commands:
```
mongosh
```

```
rs.initiate()
```
```
rs.status()
```



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
