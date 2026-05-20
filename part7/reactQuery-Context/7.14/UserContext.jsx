import { createContext, useContext, useState } from "react";
import blogService from './services/blogs'

const UserContext = createContext()
export const UserContextProvider = ({ children }) => {
	const [user, setUser] = useState(null)

	const logout = () => {
		window.localStorage.removeItem('loggedBloglistUser');
		blogService.setToken(null);
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, setUser, logout }}>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => {
	const context = useContext(UserContext)

	if (!context) {
		throw new Error("useUser must be used within a UserContextProvider")
	}

	return context
}