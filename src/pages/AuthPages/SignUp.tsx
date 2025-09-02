import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";
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
        title="Elev8 | Sign Up"
        description="Elev8 | Sign Up"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
