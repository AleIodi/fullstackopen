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

	const likeBlogMutation = useMutation({
		mutationFn: ({ id, blogToLike }) => blogService.update(id, blogToLike),
		onSuccess: (updBlog) => {
			const blogs = queryClient.getQueryData(['blogs'])
			queryClient.setQueryData(['blogs'], blogs.map(b => b.id === updBlog.id ? updBlog : b))
		},
		onError: (error) => {
			const message = error.response?.data?.error ?? "Failed to like the blog";

			dispatch({ type: 'SET_NOTIFICATION', payload: { message, type: 'error' } });
			setTimeout(() => {
				dispatch({ type: 'CLEAR_NOTIFICATION' });
			}, 5000);
		}
	})

	const deleteBlogMutation = useMutation({
		mutationFn: blogService.remove,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blogs'] });

			dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'blog deleted', type: 'success' } });
			setTimeout(() => {
				dispatch({ type: 'CLEAR_NOTIFICATION' });
			}, 5000);
		},
		onError: (error) => {
			const message = error.response?.data?.error ?? "Failed to delete the blog";

			dispatch({ type: 'SET_NOTIFICATION', payload: { message, type: 'error' } });
			setTimeout(() => {
				dispatch({ type: 'CLEAR_NOTIFICATION' });
			}, 5000);
		}
	})

	return {
		blogs: result.data,
		isPending: result.isPending,
		addBlog: (newBlogData) => newBlogMutation.mutateAsync(newBlogData),
		likeBlog: (id, blogToLike) => likeBlogMutation.mutate({ id, blogToLike }),
		deleteBlog: (id) => deleteBlogMutation.mutateAsync(id)
	}
}
