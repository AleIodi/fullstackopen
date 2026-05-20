import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext';
import { useUser } from '../UserContext';
import persistentUser from '../services/persistentUser';

export const useLogin = () => {
	const queryClient = useQueryClient()

	const dispatch = useNotificationDispatch()

	const { setUser } = useUser()

	const loginMutation = useMutation({
		mutationFn: loginService.login,
		onSuccess: (user) => {
			persistentUser.saveUser(user)
			
			setUser(user)

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