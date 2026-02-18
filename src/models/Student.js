import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    grade: { type: String, required: true },
    totalFees: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "Pending" },
    consecutiveAbsences: { type: Number, default: 0 }
});

// Next.js fix: check if model exists before defining it
export default mongoose.models.Student || mongoose.model("Student", StudentSchema);