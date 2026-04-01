"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function signOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({ redirectTo: "/" });
    router.refresh();
  };

  return (
    <div className="CompteItem">
      <button onClick={handleSignOut}>
        Déconnexion
      </button>
    </div>
  );
}
