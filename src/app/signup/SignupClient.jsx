"use client";
import AuthForm from "@/app/_components/AuthForm";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import './SignupClient.css';

const SignupClient = () => {
  const router = useRouter();

  const submitAction = async (formData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    await authClient.signUp.email({
      name: name,
      email: email,
      password: password,
      fetchOptions: {
        onSuccess: () => {
          router.push("/palmares");
        },
      },
    });
  };

  return (
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
  );
};
export default SignupClient;