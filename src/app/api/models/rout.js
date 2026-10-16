import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import ModelAsset from '@/models/ModelAsset';
import AuditLog from '@/models/AuditLog';
// GET /api/models — List all models
export async function GET() {
    try {
        await connectDB();
        const models = await ModelAsset.find({}).sort({ createdDate: -1 }).lean();
        return NextResponse.json({ success: true, data: models });
    }
    catch (error) {
        console.error('[GET /api/models]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch models' }, { status: 500 });
    }
}
// POST /api/models — Register a new model
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const exists = await ModelAsset.findOne({ id: body.id });
        if (exists) {
            return NextResponse.json({ success: false, error: 'Model with this ID already exists' }, { status: 409 });
        }
        const model = await ModelAsset.create(body);
        // Log to DB audit log
        await AuditLog.create({
            id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            userRole: body.owner ? 'Data Scientist' : 'Data Scientist',
            userName: body.owner || 'System',
            action: 'Model Registered',
            modelName: body.name,
            version: body.activeVersion || 'v1.0.0',
            details: `Model "${body.name}" registered under ${body.category}.`,
        });
        return NextResponse.json({ success: true, data: model }, { status: 201 });
    }
    catch (error) {
        console.error('[POST /api/models]', error);
        return NextResponse.json({ success: false, error: 'Failed to register model' }, { status: 500 });
    }
}
