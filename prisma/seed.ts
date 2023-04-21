import { hashSync } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const user = {
    email: "npvinh0507@gmail.com",
    password: "123456789"
};

const yamlScript = `# Config script
type: process
fields:
  pid: processId
  name: processName
  virtualMemory: RAM
filters:
  AND:
    - pid: 1
`;

async function generateSampleData() {
    const hashPassword = hashSync(user.password, SALT_ROUNDS);
    const sampleUser = await prisma.user.create({
        data: {
            email: user.email,
            password: hashPassword
        }
    });

    console.log(sampleUser);

    await prisma.cluster.create({
        data: {
            name: "BKHPC",
            remarks: "Some notes ..."
        }
    });

    await prisma.filterTemplate.create({
        data: {
            name: "Sample template",
            remarks: null,
            script: yamlScript,
            interval: 10
        }
    });
    process.exit(0);
}

generateSampleData();
