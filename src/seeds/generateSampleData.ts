import { prisma } from "../prisma";
import { hashSync } from "bcrypt";
import { SALT_ROUNDS } from "../constants/crypt";
const user = {
    email: "npvinh0507@gmail.com",
    password: "123456789"
};

async function generateSampleData() {
    const hashPassword = hashSync(user.password, SALT_ROUNDS);
    const sampleUser = await prisma.user.create({
        data: {
            email: user.email,
            password: hashPassword
        }
    });

    console.log(sampleUser);
    process.exit(0);
}

generateSampleData();
