import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const requestedPage = req.nextUrl.pathname;

    const validRoles = ['admin', 'super-user', 'SEO'];

    const url = req.nextUrl.clone();

    if (!session) {

        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;

        if (requestedPage.includes('/api')) {
            return new Response(JSON.stringify({ message: 'No autorizado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };
        return NextResponse.redirect(url);
    };

    if (requestedPage.includes('/api') && !validRoles.includes(session.user.role)) {
        return new Response(JSON.stringify({ message: 'No autorizado' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    if (requestedPage.includes('/admin') && !validRoles.includes(session.user.role)) {
        url.pathname = '/'

        return NextResponse.redirect(url)
    }

}


// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/checkout/address', '/checkout/summary', '/api/admin/dashboard', '/admin']
};