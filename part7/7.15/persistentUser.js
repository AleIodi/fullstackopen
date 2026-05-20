import blogService from "../services/blogs";

const getUser = () => {
	const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
	if (loggedUserJSON) {
		const user = JSON.parse(loggedUserJSON);
		blogService.setToken(user.token);
		return user
	}
	return null
}
const saveUser = (user) => {
	blogService.setToken(user.token)
	window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
}
const removeUser = () => {
	window.localStorage.removeItem('loggedBloglistUser');
	blogService.setToken(null);
}

export default { getUser, saveUser, removeUser }
