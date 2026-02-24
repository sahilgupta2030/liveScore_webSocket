import { eq } from 'drizzle-orm';
import { db, pool } from './db/db.js';
import { demoUsers } from './db/schema.js';

async function main() {
    try {
        console.log('Performing CRUD operations...');

        // CREATE
        const [newUser] = await db
            .insert(demoUsers)
            .values({ name: 'Admin User', email: 'admin@example.com' })
            .returning();

        if (!newUser) throw new Error('Failed to create user');
        console.log('✅ CREATE: New user created:', newUser);

        // READ
        const found = await db.select().from(demoUsers).where(eq(demoUsers.id, newUser.id));
        console.log('✅ READ: Found user:', found[0]);

        // UPDATE
        const [updatedUser] = await db
            .update(demoUsers)
            .set({ name: 'Super Admin' })
            .where(eq(demoUsers.id, newUser.id))
            .returning();

        if (!updatedUser) throw new Error('Failed to update user');
        console.log('✅ UPDATE: User updated:', updatedUser);

        // DELETE
        await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
        console.log('✅ DELETE: User deleted.');

        console.log('\nCRUD operations completed successfully.');
    } catch (err) {
        console.error('❌ Error performing CRUD operations:', err);
        process.exitCode = 1;
    } finally {
        if (pool) {
            await pool.end();
            console.log('Database pool closed.');
        }
    }
}

main();
import express from "express";

const app = express()
const port = 8000

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from Express server!")
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})