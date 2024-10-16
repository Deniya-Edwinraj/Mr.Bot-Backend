import bcrypt from 'bcryptjs';

async function testBcrypt() {
    const password = 'myPassword';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(`Hashed Password: ${hashedPassword}`);

    const match = await bcrypt.compare(password, hashedPassword);
    console.log(`Passwords match: ${match}`);
}

testBcrypt();
