import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications, markAsRead } from "../redux/slice/notification.Slice";

export default function Notifycenter() {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.list);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user?._id]);

  return (
    <div>
      <h3>Notifications ({unreadCount})</h3>
      <ul>
        {notifications.map(n => (
          <li key={n._id} style={{ opacity: n.read ? 0.5 : 1 }}>
            <b>{n.status.toUpperCase()}</b> – {n.message}
            <br/>
            <small>{new Date(n.createdAt).toLocaleString()}</small>
            {!n.read && (
              <button onClick={() => dispatch(markAsRead(n._id))}>
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
