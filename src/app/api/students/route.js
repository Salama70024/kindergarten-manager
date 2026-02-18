import dbConnect from '@/lib/db';
import StudentModel from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    const students = await StudentModel.find({});
    return NextResponse.json(students);
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json();
    const newStudent = new StudentModel(body);
    await newStudent.save();
    return NextResponse.json(newStudent);
}