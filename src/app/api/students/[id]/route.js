import dbConnect from '@/lib/db';
import StudentModel from '@/models/Student';
import { NextResponse } from 'next/server';

// UPDATE PAYMENT or ATTENDANCE
export async function PUT(request, { params }) {
    await dbConnect();
    const id = params.id;
    const body = await request.json();
    
    // We use findByIdAndUpdate to handle both Logic cases (Money or Attendance)
    // In a real app, we might split this, but for MVP this is fine.
    
    const student = await StudentModel.findById(id);
    
    if (body.action === 'payment') {
        student.paidAmount += Number(body.amount);
        if (student.paidAmount >= student.totalFees) student.paymentStatus = "Paid";
        else student.paymentStatus = "Partial";
    } 
    else if (body.action === 'attendance') {
        if (body.status === 'absent') student.consecutiveAbsences += 1;
        else student.consecutiveAbsences = 0;
    }

    await student.save();
    return NextResponse.json(student);
}

// DELETE STUDENT
export async function DELETE(request, { params }) {
    await dbConnect();
    const id = params.id;
    await StudentModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
}