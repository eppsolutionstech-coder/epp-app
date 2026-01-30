import { createContext } from "react";
import type { UserWithRelation } from "~/zod/user.zod";
import type { loginResponse } from "~/types/auth";

export interface AuthContextType {
	user: UserWithRelation | null;
	isLoading: boolean;
	error: string | null;
	login: (identifier: string, password: string) => Promise<loginResponse>;
	logout: () => Promise<void>;
	getCurrentUser: () => Promise<void>;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
