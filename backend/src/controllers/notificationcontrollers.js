import Notification from "../models/notification.js";


// ========================================
// GET NOTIFICATIONS
// ========================================

export const getNotifications =
    async (req, res) => {

        try {

            const notifications =
                await Notification.find({

                    targetRoles:
                        req.user.role

                })
                    .sort({
                        createdAt: -1
                    })
                    .limit(50)
                    .lean();


            const formatted =
                notifications.map(
                    (notification) => {

                        const isRead =
                            (
                                notification.readBy ||
                                []
                            ).some(
                                (userId) =>
                                    userId.toString() ===
                                    req.user.id
                            );


                        const {
                            readBy,
                            ...rest
                        } = notification;


                        return {
                            ...rest,
                            isRead
                        };

                    }
                );


            const unreadCount =
                formatted.filter(
                    (notification) =>
                        !notification.isRead
                ).length;


            res.status(200).json({

                success: true,

                unreadCount,

                notifications:
                    formatted

            });


        } catch (error) {

            console.error(
                "Notifications error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    "Failed to load notifications."
            });

        }

    };


// ========================================
// MARK ONE READ
// ========================================

export const markNotificationRead =
    async (req, res) => {

        try {

            const notification =
                await Notification.findOne({

                    _id:
                        req.params.id,

                    targetRoles:
                        req.user.role

                });


            if (!notification) {

                return res.status(
                    404
                ).json({
                    success: false,
                    message:
                        "Notification not found."
                });

            }


            await Notification.updateOne(
                {
                    _id:
                        notification._id
                },

                {
                    $addToSet: {
                        readBy:
                            req.user.id
                    }
                }
            );


            res.status(200).json({
                success: true,
                message:
                    "Notification marked as read."
            });


        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    "Failed to update notification."
            });

        }

    };


// ========================================
// MARK ALL READ
// ========================================

export const markAllNotificationsRead =
    async (req, res) => {

        try {

            await Notification.updateMany(

                {
                    targetRoles:
                        req.user.role,

                    readBy: {
                        $ne:
                            req.user.id
                    }
                },

                {
                    $addToSet: {
                        readBy:
                            req.user.id
                    }
                }

            );


            res.status(200).json({
                success: true,
                message:
                    "All notifications marked as read."
            });


        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    "Failed to update notifications."
            });

        }

    };
    