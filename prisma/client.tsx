
// import { PrismaClient } from "../lib/generated/prisma"; //[BECAUSE NO OUTPUT] ==> IF OUTPUT THEN USE PATH
// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient;
// };
// const prisma = globalForPrisma.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// export default prisma;


// prisma/client.ts (or lib/prisma.ts)
import { PrismaClient } from '@prisma/client'; 

// This declares a global variable 'prisma' to store the PrismaClient instance.
// It prevents multiple instances from being created during hot reloads in development.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production, create a new instance directly.
  prisma = new PrismaClient();
} else {
  // In development, use the global variable.
  // If it doesn't exist, create and store it.
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
