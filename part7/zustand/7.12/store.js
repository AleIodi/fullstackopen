import { create } from 'zustand'
import blogService from './src/services/blogs'

const useNotificationStore = create((set, get) => ({
	message: "",
	show: false,
	timeoutId: null,
	type: "success" | "error",
	showNotification: (message, type = "success", duration = 5) => {
		const currentTimeout = get().timeoutId
		if (currentTimeout) {
			clearTimeout(currentTimeout)
		}

		set({ message, show: true, type })

		const id = setTimeout(() => {
			set({ message: "", show: false, timeoutId: null })
		}, duration * 1000);

		set({ timeoutId: id })
	}
}))

export const useNotify = () => useNotificationStore(state => state.showNotification)
export const useNotifyMessage = () => useNotificationStore(state => state.message)
export const useNotifyIsVisible = () => useNotificationStore(state => state.show)
export const useNotifyType = () => useNotificationStore(state => state.type)

const useBlogStore = create((set, get) => ({
	blogs: [],
	isLoading: false,
	actions: {
		inizialize: async () => {
			set({ isLoading: true });
			try {
				const blogs = await blogService.getAll()
				set({ blogs })
			} catch {
				useNotificationStore.getState().showNotification("Failed to fetch blogs", "error");
			} finally {
				set({ isLoading: false });
			}
		},

		addBlog: async (newBlog) => {
			try {
				const blog = await blogService.create(newBlog)
				set(state => ({ blogs: state.blogs.concat(blog) }))
				useNotificationStore.getState().showNotification(`a new blog '${blog.title}' by '${blog.author}' added`)
			} catch (exception) {
				const serverErrorMessage =
					exception.response?.data?.error ?? "Failed to create new blog";

				useNotificationStore.getState().showNotification(serverErrorMessage, "error");
			}
		},
	}
}))

export const useBlogIsLoading = () => useBlogStore((state) => state.isLoading)
export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
