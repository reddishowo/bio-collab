// File: /app/actions.ts

'use server';

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'biocollab_db';

// --- TIPE DATA ---

// Struktur jawaban untuk SATU materi (misal: hanya Virus)
export interface LKPDItem {
  tugas: string;
  inkubasi: string;
  iluminasi: string;
  verifikasi: string;
}

// Pilihan Topik yang valid
export type Topic = 'virus' | 'bakteri' | 'jamur';

// Struktur Dokumen Kelompok di MongoDB
interface GroupDocument {
  _id?: ObjectId;
  groupName: string;
  groupCode: string;
  members: string[];
  createdAt: Date;
  // LKPD sekarang nested: lkpd.virus, lkpd.bakteri, dll.
  lkpd?: {
    virus?: LKPDItem;
    bakteri?: LKPDItem;
    jamur?: LKPDItem;
  };
}

// Data yang dikirim ke Frontend (Client Component)
export interface GroupData {
  _id: string; // Kita pakai groupCode sebagai ID di frontend
  groupName: string;
  groupCode: string;
  members: string[];
  lkpd?: {
    virus?: LKPDItem;
    bakteri?: LKPDItem;
    jamur?: LKPDItem;
  };
}

interface ChatDocument {
  groupCode: string;
  userName: string;
  message: string;
  createdAt: Date;
}

export interface ChatMessage {
  _id: string;
  groupCode: string;
  userName: string;
  message: string;
  createdAt: string;
}

// Return types
export type GroupActionResult =
  | { success: true; group: GroupData }
  | { success: false; message: string };

// Helper: Konversi dari dokumen Mongo ke format Frontend
function toGroupData(group: GroupDocument): GroupData {
  return {
    _id: group.groupCode, // Gunakan groupCode sebagai unique key di UI
    groupName: group.groupName,
    groupCode: group.groupCode,
    members: group.members,
    lkpd: group.lkpd ?? {}, // Pastikan lkpd tidak undefined
  };
}

// --- 1. BUAT KELOMPOK BARU ---
export async function createGroup(groupName: string, leaderName: string): Promise<GroupActionResult> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const groupsCollection = db.collection<GroupDocument>('groups');

    // Generate Kode Unik 6 Digit
    let groupCode = '';
    let isDuplicate = true;

    while (isDuplicate) {
      groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await groupsCollection.findOne({ groupCode });
      if (!existing) isDuplicate = false;
    }

    const newGroup: GroupDocument = {
      groupName,
      groupCode,
      members: [leaderName],
      createdAt: new Date(),
      lkpd: {} // Inisialisasi objek kosong
    };

    await groupsCollection.insertOne(newGroup);
    
    return { 
      success: true, 
      group: toGroupData(newGroup)
    };
  } catch (error) {
    console.error("Error createGroup:", error);
    return { success: false, message: 'Gagal membuat kelompok' };
  }
}

// --- 2. GABUNG KELOMPOK ---
export async function joinGroup(code: string, memberName: string): Promise<GroupActionResult> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const groupsCollection = db.collection<GroupDocument>('groups');
    const groupCode = code.toUpperCase();

    const group = await groupsCollection.findOne({ groupCode });

    if (!group) {
      return { success: false, message: 'Kode kelompok tidak ditemukan!' };
    }

    // Jika user sudah ada, return sukses langsung (idempotent)
    if (group.members.includes(memberName)) {
       return { 
        success: true, 
        group: toGroupData(group)
      };
    }

    // Tambahkan anggota baru (cegah duplikasi dengan $addToSet)
    await groupsCollection.updateOne(
      { groupCode },
      { $addToSet: { members: memberName } }
    );

    // Ambil data terbaru
    const updatedGroup = await groupsCollection.findOne({ groupCode });

    if (!updatedGroup) {
      return { success: false, message: 'Gagal mengambil data kelompok.' };
    }

    return { 
      success: true, 
      group: toGroupData(updatedGroup)
    };
  } catch (error) {
    console.error("Error joinGroup:", error);
    return { success: false, message: 'Gagal bergabung' };
  }
}

// --- 3. AMBIL DATA CHAT ---
export async function getChatMessages(groupCode: string): Promise<ChatMessage[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const chatsCollection = db.collection<ChatDocument>('chats');
    
    const messages = await chatsCollection
      .find({ groupCode })
      .sort({ createdAt: 1 }) 
      .toArray();
      
    return messages.map((msg) => ({
      _id: msg._id.toString(),
      groupCode: msg.groupCode,
      userName: msg.userName,
      message: msg.message,
      createdAt: msg.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("Error getChatMessages:", error);
    return [];
  }
}

// --- 4. KIRIM PESAN ---
export async function sendChatMessage(groupCode: string, userName: string, message: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const chatsCollection = db.collection<ChatDocument>('chats');
    
    await chatsCollection.insertOne({
      groupCode,
      userName,
      message,
      createdAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error sendChatMessage:", error);
    return { success: false };
  }
}

// --- 5. SIMPAN JAWABAN LKPD (DINAMIS PER TOPIK) ---
export async function saveLKPD(groupCode: string, topic: Topic, lkpdData: LKPDItem) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const groupsCollection = db.collection<GroupDocument>('groups');
    
    // Gunakan notasi dot (titik) untuk update field spesifik
    // Contoh: lkpd.virus, lkpd.bakteri, dst.
    const updateField = `lkpd.${topic}`;

    await groupsCollection.updateOne(
      { groupCode },
      { $set: { [updateField]: lkpdData } }
    );
    return { success: true };
  } catch (error) {
    console.error("Error saveLKPD:", error);
    return { success: false };
  }
}

// --- 6. AMBIL DATA KELOMPOK TERBARU ---
export async function getGroupData(groupCode: string): Promise<GroupData | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const groupsCollection = db.collection<GroupDocument>('groups');
    
    const group = await groupsCollection.findOne({ groupCode });

    if (!group) return null;

    return toGroupData(group);
  } catch (error) {
    return null;
  }
}