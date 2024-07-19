import { INotificationDocument } from '@notification/interfaces/notification.interface';
import { NotificationModel } from '@notification/models/notification.schema';
import mongoose from 'mongoose';

interface SendNotificationParams {
  toUserId: string;
  fromUserId: string;
  type: string;
  requestId?: string;
  message: string;
  // Puedes agregar más campos según sea necesario
}

class NotificationService {
  public async getNotifications(userId: string): Promise<INotificationDocument[]> {
    const notifications: INotificationDocument[] = await NotificationModel.aggregate([
      { $match: { userTo: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'User', localField: 'userFrom', foreignField: '_id', as: 'userFrom' } },
      { $unwind: '$userFrom' },
      { $lookup: { from: 'Auth', localField: 'userFrom.authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      {
        $project: {
          _id: 1,
          message: 1,
          comment: 1,
          createdAt: 1,
          createdItemId: 1,
          entityId: 1,
          notificationType: 1,
          gifUrl: 1,
          imgId: 1,
          imgVersion: 1,
          post: 1,
          reaction: 1,
          read: 1,
          userTo: 1,
          userFrom: {
            profilePicture: '$userFrom.profilePicture',
            username: '$authId.username',
            avatarColor: '$authId.avatarColor',
            uId: '$authId.uId'
          }
        }
      }
    ]);
    return notifications;
  }

  public async updateNotification(notificationId: string): Promise<void> {
    await NotificationModel.updateOne({ _id: notificationId }, { $set: { read: true } }).exec();
  }

  public async deleteNotification(notificationId: string): Promise<void> {
    await NotificationModel.deleteOne({ _id: notificationId }).exec();
  }

  public async sendNotification(params: SendNotificationParams): Promise<INotificationDocument> {
    const newNotification = new NotificationModel({
      userTo: new mongoose.Types.ObjectId(params.toUserId),
      userFrom: new mongoose.Types.ObjectId(params.fromUserId),
      notificationType: params.type,
      message: params.message,
      createdItemId: params.requestId
    });

    await newNotification.save();
    return newNotification;
  }
}

export const notificationService: NotificationService = new NotificationService();
