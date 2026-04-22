import { useNotificationMessage, useNotificationShow } from "../store"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const message = useNotificationMessage()
  const show = useNotificationShow()

  return (
    <>
      {show && <div style={style}>{message}</div>}
    </>
  )
}

export default Notification
