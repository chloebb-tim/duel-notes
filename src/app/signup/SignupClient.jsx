"use client";
import AuthForm from "@/app/_components/AuthForm";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import './SignupClient.css';

const SignupClient = () => {
  const router = useRouter();

  const submitAction = async (formData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!password || String(password).length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      const result = await authClient.signUp.email({
        name: name,
        email: email,
        password: password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/palmares");
          },
          onError: (ctx) => {
            const serverMessage = ctx?.error?.message || "";
            if (serverMessage.toLowerCase().includes("password") || serverMessage.includes("mot de passe")) {
              toast.error("Le mot de passe doit contenir au moins 8 caractères.");
              return;
            }
            toast.error("Erreur");
          },
        },
      });

      if (result?.error) {
        const errorMessage = result.error.message || "";
        if (errorMessage.toLowerCase().includes("password") || errorMessage.includes("mot de passe")) {
          toast.error("Le mot de passe doit contenir au moins 8 caractères.");
          return;
        }
        toast.error("Erreur");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  return (
    <>
      <div className="signup-page">
        <AuthForm
          titre={"Inscription"}
          formAction={submitAction}
          showName={true}
          ctaTitle={"S'inscrire"}
          passwordMinLength={8}
          passwordHint={"Minimum 8 caractères"}
        >
          <p>
            Vous avez déjà un compte ?{" "}
            <a href="/signin">
              Connectez-vous
            </a>
          </p>
        </AuthForm>
      </div>
      <ToastContainer position="bottom-right" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
    </>
  );
};
export default SignupClient;