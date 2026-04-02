"use client";
import AuthForm from "@/app/_components/AuthForm";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import './SignInClient.css';


const SignInClient = () => {
  const router = useRouter();

  const submitAction = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onSuccess: () => {
          router.push("/palmares");
        },
      },
    });
  };

  return (
    // <div className="popopOverlay">
    //   <div className="popop">

    //     <span className="fermerBtn" onClick={() => setIsOpen(false)}>
    //       ✕
    //     </span>

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

    //   </div>
    // </div>
  );
};
export default SignInClient;