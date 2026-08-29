import {
    useEffect,
    useState
} from "react";

import "../css/notificationCenter.css";

import socket from "../services/socketService.js";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "../services/notificationService.js";


function NotificationCenter() {

    const [
        notifications,
        setNotifications
    ] = useState([]);


    const [
        unreadCount,
        setUnreadCount
    ] = useState(0);


    const [
        open,
        setOpen
    ] = useState(false);


    const [
        loading,
        setLoading
    ] = useState(false);


    const loadNotifications =
        async (
            silent = false
        ) => {

            try {

                if (!silent) {

                    setLoading(
                        true
                    );

                }


                const data =
                    await getNotifications();


                setNotifications(

                    Array.isArray(
                        data?.notifications
                    )
                        ? data.notifications
                        : []

                );


                setUnreadCount(
                    Number(
                        data?.unreadCount
                    ) || 0
                );


            } catch (error) {

                console.error(
                    "Notification load error:",
                    error
                );


            } finally {

                if (!silent) {

                    setLoading(
                        false
                    );

                }

            }

        };


    useEffect(() => {

        loadNotifications();


        const handleRefresh =
            () => {

                loadNotifications(
                    true
                );

            };


        socket.on(
            "notifications:refresh",
            handleRefresh
        );


        return () => {

            socket.off(
                "notifications:refresh",
                handleRefresh
            );

        };

    }, []);


    const handleRead =
        async (
            notification
        ) => {

            if (
                notification.isRead
            ) {

                return;

            }


            try {

                await markNotificationRead(
                    notification._id
                );


                setNotifications(
                    (previous) =>
                        previous.map(
                            (item) =>

                                item._id ===
                                notification._id

                                    ? {
                                        ...item,
                                        isRead: true
                                    }

                                    : item

                        )
                );


                setUnreadCount(
                    (previous) =>
                        Math.max(
                            0,
                            previous - 1
                        )
                );


            } catch (error) {

                console.error(
                    error
                );

            }

        };


    const handleReadAll =
        async () => {

            try {

                await markAllNotificationsRead();


                setNotifications(
                    (previous) =>
                        previous.map(
                            (item) => ({
                                ...item,
                                isRead: true
                            })
                        )
                );


                setUnreadCount(
                    0
                );


            } catch (error) {

                console.error(
                    error
                );

            }

        };


    return (

        <div className="notification-center">


            <button
                type="button"

                className="notification-floating-button"

                onClick={() =>
                    setOpen(
                        (previous) =>
                            !previous
                    )
                }
            >

                🔔


                {
                    unreadCount > 0 && (

                        <span className="notification-badge">

                            {
                                unreadCount >
                                99
                                    ? "99+"
                                    : unreadCount
                            }

                        </span>

                    )
                }

            </button>


            {
                open && (

                    <div className="notification-panel">


                        <div className="notification-header">

                            <div>

                                <h3>
                                    Notifications
                                </h3>

                                <span>

                                    {
                                        unreadCount
                                    } unread

                                </span>

                            </div>


                            {
                                unreadCount >
                                0 && (

                                    <button
                                        type="button"

                                        onClick={
                                            handleReadAll
                                        }
                                    >

                                        Mark all read

                                    </button>

                                )
                            }

                        </div>


                        <div className="notification-list">


                            {
                                loading ? (

                                    <div className="notification-empty">

                                        Loading...

                                    </div>

                                ) : notifications.length ===
                                0 ? (

                                    <div className="notification-empty">

                                        No notifications yet.

                                    </div>

                                ) : (

                                    notifications.map(
                                        (notification) => (

                                            <button
                                                type="button"

                                                key={
                                                    notification._id
                                                }

                                                className={
                                                    `notification-item ${
                                                        notification.isRead
                                                            ? ""
                                                            : "unread"
                                                    } ${
                                                        notification.type
                                                            ?.toLowerCase() ||
                                                        "info"
                                                    }`
                                                }

                                                onClick={() =>
                                                    handleRead(
                                                        notification
                                                    )
                                                }
                                            >

                                                <div className="notification-item-top">

                                                    <strong>

                                                        {
                                                            notification.title
                                                        }

                                                    </strong>


                                                    {
                                                        !notification.isRead && (

                                                            <span className="notification-dot" />

                                                        )
                                                    }

                                                </div>


                                                <p>

                                                    {
                                                        notification.message
                                                    }

                                                </p>


                                                <small>

                                                    {
                                                        notification.createdAt
                                                            ? new Date(
                                                                notification.createdAt
                                                            ).toLocaleString()
                                                            : ""
                                                    }

                                                </small>

                                            </button>

                                        )
                                    )

                                )
                            }


                        </div>


                    </div>

                )
            }


        </div>

    );

}


export default NotificationCenter;