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

    try {
      const result = await authClient.signUp.email({
        name: name,
        email: email,
        password: password,
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
      <div className="signup-page">
        <AuthForm
          titre={"Inscription"}
          formAction={submitAction}
          showName={true}
          ctaTitle={"S'inscrire"}
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