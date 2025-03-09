import { redirect } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { ProductManager } from "../../components/admin/ProductManager";
import { getConvexClient } from "../../lib/convex";

export default async function AdminPage() {
  const client = getConvexClient();

  try {
    const viewer = await client.query(api.users.viewer, {});

    if (!viewer || !viewer.user || viewer.user.role !== "admin") {
      redirect("/");
    }

    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
        <ProductManager />
      </div>
    );
  } catch (error) {
    console.error("Error checking admin access:", error);
    redirect("/");
  }
}
