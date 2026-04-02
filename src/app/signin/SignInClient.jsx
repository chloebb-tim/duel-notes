"use client";
import AuthForm from "@/app/_components/AuthForm";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import './SignInClient.css';


const SignInClient = () => {
  const router = useRouter();

  const submitAction = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/palmares");
          },
          onError: () => {
            toast.error("Erreur");
          },
        },
      });

      if (result?.error) {
        toast.error("Erreur");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  return (
      <>
        <div className="signin-page">
          <AuthForm
            titre="Connexion"
            showName={false}
            formAction={submitAction}
            ctaTitle="Se connecter"
          >
            <p className="compteText">
              Vous voulez créer un compte ?{" "}
              <a href="/signup">
                Inscrivez-vous
              </a>
            </p>
          </AuthForm>
        </div>
        <ToastContainer position="bottom-right" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
      </>
  );
};
export default SignInClient;