import { getAllGroups } from "@/app/actions";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  // Ambil data di server
  const groups = await getAllGroups();

  // Kirim data ke komponen client untuk dianimasikan
  return <DashboardClient groups={groups} />;
}