import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext';

export const useBlogs = () => {
	const queryClient = useQueryClient()

	const dispatch = useNotificationDispatch()

	const result = useQuery({
		queryKey: ['blogs'],
		queryFn: blogService.getAll
	})

	const newBlogMutation = useMutation({
		mutationFn: blogService.create,
		onSuccess: (newBlog) => {
			const blogs = queryClient.getQueryData(['blogs'])
			queryClient.setQueryData(['blogs'], blogs.concat(newBlog))

			dispatch({ type: 'SET_NOTIFICATION', payload: { message: `a new blog ${newBlog.title} by ${newBlog.author} added`, type: 'success' } });
			setTimeout(() => {
				dispatch({ type: 'CLEAR_NOTIFICATION' });
			}, 5000);
		},
		onError: (error) => {
			const message = error.response?.data?.error ?? "Failed to create new blog";

			dispatch({ type: 'SET_NOTIFICATION', payload: { message, type: 'error' } });
			setTimeout(() => {
				dispatch({ type: 'CLEAR_NOTIFICATION' });
			}, 5000);
		}
	})

	return {
		blogs: result.data,
		isPending: result.isPending,
		addBlog: async (newBlogData) => await newBlogMutation.mutate(newBlogData)
	}
}