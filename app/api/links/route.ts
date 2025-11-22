import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createLinkSchema } from '@/lib/validation';
import { generateShortCode } from '@/lib/utils';

// POST /api/links - Create a new short link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = createLinkSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { targetUrl, customCode } = validation.data;

        // Generate code if not provided
        const code = customCode || generateShortCode();

        // Check if code already exists
        const existing = await prisma.link.findUnique({
            where: { code },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Code already exists. Please choose a different code.' },
                { status: 409 }
            );
        }

        // Create the link
        const link = await prisma.link.create({
            data: {
                code,
                targetUrl,
            },
        });

        return NextResponse.json(link, { status: 201 });
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/links - List all links
export async function GET() {
    try {
        const links = await prisma.link.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(links, { status: 200 });
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
