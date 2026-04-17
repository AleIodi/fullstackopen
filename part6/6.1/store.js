import { create } from 'zustand'


const useFeedbackStore = create(set => ({
	feedbacks: {
		good: 0,
		neutral: 0,
		bad: 0
	},
	actions: {
		goodInc: () => set(state => ({
			feedbacks: { ...state.feedbacks, good: state.feedbacks.good + 1 }
		})),
		neutralInc: () => set(state => ({
			feedbacks: { ...state.feedbacks, neutral: state.feedbacks.neutral + 1 }
		})),
		badInc: () => set(state => ({
			feedbacks: { ...state.feedbacks, bad: state.feedbacks.bad + 1 }
		}))
	}
}))

export const useFeedback = () => useFeedbackStore(state => state.feedbacks)
export const useFeedbackActions = () => useFeedbackStore(state => state.actions)
