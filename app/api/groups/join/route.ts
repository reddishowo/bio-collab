import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Group from "@/models/Group";

export async function POST(req: Request) {
  try {
    const { code, memberName } = await req.json();
    await connectToDatabase();

    const group = await Group.findOne({ code: code.toUpperCase() });

    if (!group) {
      return NextResponse.json({ success: false, message: "Kode kelompok tidak ditemukan!" }, { status: 404 });
    }

    // Cek jika nama sudah ada di kelompok tersebut
    if (group.members.includes(memberName)) {
      return NextResponse.json({ success: false, message: "Nama ini sudah ada di dalam kelompok!" }, { status: 400 });
    }

    // Tambahkan anggota baru
    group.members.push(memberName);
    await group.save();

    return NextResponse.json({ success: true, group }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal bergabung ke kelompok" }, { status: 500 });
  }
}