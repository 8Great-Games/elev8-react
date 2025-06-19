import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";


export default function SignIn() {
  const { user } = useAuth();
  if (user) {
    // Kullanıcı zaten giriş yapmış, ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageMeta
        title="Elev8 | Sign In"
        description="Elev8 | Sign In"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
