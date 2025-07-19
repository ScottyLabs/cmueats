import { getEmails } from './db';

Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === '/api/emails') {
            const emails = await getEmails();
            return new Response(JSON.stringify(emails), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response('Not Found', { status: 404 });
    },
});

console.log('✅ Server is running on http://localhost:3000 (if local)');
