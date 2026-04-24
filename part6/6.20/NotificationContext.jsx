import { createContext, useState } from 'react'

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [message, setMessage] = useState(null)

  const showNotification = (message) => {
	setMessage(message)
	setTimeout(() => {
		setMessage(null)
	}, 5000);
  }

  return (
    <NotificationContext.Provider value={{ showNotification, message }}>
      {props.children}
    </NotificationContext.Provider>
  )
}