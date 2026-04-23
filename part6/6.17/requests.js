const baseUrl = 'http://localhost:3001/anecdotes'


export const getAll = async () => {
	const response = await fetch(baseUrl)

	if (!response.ok)
		throw new Error("Failed to fetch anecdotes");

	return await response.json()
}

export const createNew = async (anecdote) => {
	if (anecdote.content.length < 5)
		throw new Error("Content must be at least 5 characters");

	const response = await fetch(baseUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(anecdote)
	})

	if (!response.ok) {
		throw new Error('Failed to create anecdote')
	}

	return await response.json()
}
