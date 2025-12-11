import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearLastEntry() {
    try {
        console.log('Fetching last created doctor...');
        const lastDoctor = await prisma.doctor.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!lastDoctor) {
            console.log('No doctors found in the database.');
            return;
        }

        console.log(`Found doctor: ${lastDoctor.name} (${lastDoctor.id}) created at ${lastDoctor.createdAt}`);
        console.log('Deleting doctor and associated data (slots, bookings)...');

        await prisma.doctor.delete({
            where: {
                id: lastDoctor.id,
            },
        });

        console.log('Successfully deleted the last doctor entry.');
    } catch (error) {
        console.error('Error executing script:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearLastEntry();
