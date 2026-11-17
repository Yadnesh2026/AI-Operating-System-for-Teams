const NotificationModel = require("../model/NotificationModel");

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notifications = await NotificationModel.find({
      userId: userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Notifications fetched successfully",
      notifications
    });

  } catch (err) {
    next(err);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const notification = await NotificationModel.findOneAndDelete({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, deleteNotification };