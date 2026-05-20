import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext';
import { useUser } from '../UserContext';

export const useLogin = () => {
	const queryClient = useQueryClient()

	const dispatch = useNotificationDispatch()

	const { setUser } = useUser()

	const loginMutation = useMutation({
		mutationFn: loginService.login,
		onSuccess: (user) => {
			setUser(user)

			blogService.setToken(user.token);
			window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));

			dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'login successful', type: 'success' } });
			setTimeout(() => {
				dispatch({ type: 'CLEAR_NOTIFICATION' });
			}, 5000);
		},

		onError: (error) => {
			const message = error.response?.data?.error ?? "Wrong credentials";

			dispatch({ type: 'SET_NOTIFICATION', payload: { message, type: 'error' } });
			setTimeout(() => {
				dispatch({ type: 'CLEAR_NOTIFICATION' });
			}, 5000);
		}
	})

	return {
		login: (credentials) => loginMutation.mutateAsync(credentials),
		isPending: loginMutation.isPending
	}
}