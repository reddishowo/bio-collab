'use server';

import clientPromise from '@/lib/mongodb';

const DB_NAME = 'biocollab_db';

// --- FETCH SEMUA KELOMPOK ---
export async function getAllGroups() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const groups = await db.collection('groups').find({}).sort({ createdAt: -1 }).toArray();
    
    return groups.map(g => ({
      _id: g._id.toString(),
      groupName: g.groupName,
      groupCode: g.groupCode,
      members: g.members || [],
      createdAt: g.createdAt ? g.createdAt.toISOString() : null,
      lkpd: g.lkpd || {},
      evaluasiTim: g.evaluasiTim || null
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

// --- FETCH DETAIL SATU KELOMPOK ---
export async function getGroupDetail(groupCode: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const group = await db.collection('groups').findOne({ groupCode });
    
    if (!group) return null;

    return {
      _id: group._id.toString(),
      groupName: group.groupName,
      groupCode: group.groupCode,
      members: group.members || [],
      lkpd: group.lkpd || {},
      evaluasiTim: group.evaluasiTim || null
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// --- FETCH CHAT KELOMPOK ---
export async function getGroupChats(groupCode: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const chats = await db.collection('chats').find({ groupCode }).sort({ createdAt: 1 }).toArray();
    
    return chats.map(c => ({
      _id: c._id.toString(),
      userName: c.userName,
      message: c.message,
      createdAt: c.createdAt ? c.createdAt.toISOString() : null
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

// --- FETCH EVALUASI INDIVIDU KELOMPOK ---
export async function getGroupEvaluations(groupCode: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const evals = await db.collection('evaluations').find({ groupCode }).toArray();
    
    return evals.map(e => ({
      _id: e._id.toString(),
      userName: e.userName,
      skorPengetahuan: e.skorPengetahuan,
      submittedAt: e.submittedAt ? e.submittedAt.toISOString() : null
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}