import { create } from "zustand";
import blogService from "./src/services/blogs";
import loginService from './src/services/login'

const useNotificationStore = create((set, get) => ({
  message: "",
  show: false,
  timeoutId: null,
  type: "success" | "error",
  showNotification: (message, type = "success", duration = 5) => {
    const currentTimeout = get().timeoutId;
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    set({ message, show: true, type });

    const id = setTimeout(() => {
      set({ message: "", show: false, timeoutId: null });
    }, duration * 1000);

    set({ timeoutId: id });
  },
}));
export const useNotify = () =>
  useNotificationStore((state) => state.showNotification);
export const useNotifyMessage = () =>
  useNotificationStore((state) => state.message);
export const useNotifyIsVisible = () =>
  useNotificationStore((state) => state.show);
export const useNotifyType = () => useNotificationStore((state) => state.type);

const useBlogStore = create((set, get) => ({
  blogs: [],
  isLoading: false,
  actions: {
    inizialize: async () => {
      set({ isLoading: true });
      try {
        const blogs = await blogService.getAll();
        set({ blogs });
      } catch {
        useNotificationStore
          .getState()
          .showNotification("Failed to fetch blogs", "error");
      } finally {
        set({ isLoading: false });
      }
    },

    addBlog: async (newBlog) => {
      try {
        const blog = await blogService.create(newBlog);
        set((state) => ({ blogs: state.blogs.concat(blog) }));
        useNotificationStore
          .getState()
          .showNotification(
            `a new blog '${blog.title}' by '${blog.author}' added`,
          );

        return true;
      } catch (exception) {
        const serverErrorMessage =
          exception.response?.data?.error ?? "Failed to create new blog";

        useNotificationStore
          .getState()
          .showNotification(serverErrorMessage, "error");

        return false;
      }
    },

    likeBlog: async (id, blogToLike) => {
      try {
        const response = await blogService.update(id, blogToLike);
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === id ? response : b)),
        }));
      } catch (exception) {
        const serverErrorMessage =
          exception.response?.data?.error ?? "Failed to like the blog";

        useNotificationStore
          .getState()
          .showNotification(serverErrorMessage, "error");
      }
    },

    deleteBlog: async (id) => {
      const blog = get().blogs.find((b) => b.id === id);
      if (
        blog &&
        window.confirm(`Remove blog '${blog.title}' by '${blog.author}'`)
      ) {
        try {
          await blogService.remove(id);

          set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) }));
          useNotificationStore.getState().showNotification("Blog deleted");

          return true;
        } catch (exception) {
          const serverErrorMessage =
            exception.response?.data?.error ?? "Failed to delete the blog";

          useNotificationStore
            .getState()
            .showNotification(serverErrorMessage, "error");

          return false;
        }
      }
      return false;
    },
  },
}));
export const useBlogIsLoading = () => useBlogStore((state) => state.isLoading);
export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogActions = () => useBlogStore((state) => state.actions);

const useUserStore = create((set) => ({
  user: null,

  actions: {
    inizialize: () => {
      const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
      if (loggedUserJSON) {
        try {
          const user = JSON.parse(loggedUserJSON);
          set({ user });
          blogService.setToken(user.token);
        } catch (error) {
          window.localStorage.removeItem("loggedBloglistUser");
        }
      }
    },

    login: async (userToLogin) => {
      try {
        const user = await loginService.login(userToLogin);
        blogService.setToken(user.token);
        window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));

        set({ user })

        useNotificationStore
          .getState()
          .showNotification("login successful");

          return true;
      } catch (exception) {
        const serverErrorMessage =
          exception.response?.data?.error ?? "Wrong credentials";

        useNotificationStore
          .getState()
          .showNotification(serverErrorMessage, "error");

          return false;
      }
    },

    logout: () => {
      window.localStorage.removeItem("loggedBloglistUser");
      set({ user: null })
      blogService.setToken(null);
    }
  },
}))
export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)
