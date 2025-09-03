import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import axios from "axios";

// Kullanıcı tipi
type User = {
    name: string;
    surname: string;
    email: string;
    role: string;
    picture?: string;
};

// Context tipi
type AuthContextType = {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
};

// Context oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider bileşeni
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/auth/me", { withCredentials: true })
            .then((res) => { setUser(res.data.user); })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
// context/AuthContext.tsx
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    const { user, loading, setUser } = context;
    return { user, loading, setUser, isAuthenticated: !!user };
}
