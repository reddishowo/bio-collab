import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Group from "@/models/Group";

// Fungsi generate kode unik acak 6 karakter
const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export async function POST(req: Request) {
  try {
    const { groupName, leaderName } = await req.json();
    await connectToDatabase();

    // Pastikan kode benar-benar unik
    let uniqueCode = generateCode();
    let isDuplicate = await Group.findOne({ code: uniqueCode });
    while (isDuplicate) {
      uniqueCode = generateCode();
      isDuplicate = await Group.findOne({ code: uniqueCode });
    }

    // Buat kelompok baru dan masukkan nama ketua sbg anggota pertama
    const newGroup = await Group.create({
      name: groupName,
      code: uniqueCode,
      members: [leaderName], 
    });

    return NextResponse.json({ success: true, group: newGroup }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal membuat kelompok" }, { status: 500 });
  }
}