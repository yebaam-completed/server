import { notificationService } from '@service/db/notification.service';
import { friendRequestService } from '@service/db/senfriend.service';
import { userService } from '@user/services/user.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class FriendRequestController {
  // async sendFriendRequest(req: Request, res: Response): Promise<void> {
  //   const { receiverId } = req.body;
  //   const senderId = req.currentUser!.userId;
  //   const friendRequest = await friendRequestService.createFriendRequest(senderId, receiverId);
  //   res.status(HTTP_STATUS.CREATED).json(friendRequest);
  // }

//   async acceptFriendRequest(req: Request, res: Response): Promise<void> {
//     const { requestId } = req.params;

//     try {
//         const { updatedRequest, senderId, receiverId } = await friendRequestService.updateFriendRequestStatus(requestId, 'accepted');

//         // Actualiza los contadores en MongoDB
//         await userService.incrementFollowersCount(receiverId);
//         await userService.incrementFollowingCount(senderId);

//         // Actualiza los contadores en Redis
//         // redisClient.hIncrBy(`users:${receiverId}`, 'followersCount', 1);
//         // redisClient.hIncrBy(`users:${senderId}`, 'followingCount', 1);

//         // Responde a la solicitud
//         res.status(HTTP_STATUS.OK).json(updatedRequest);
//     } catch (error) {
//         console.error('Error al aceptar solicitud de amistad:', error);
//         res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Error al procesar la solicitud');
//     }
// }
//   async rejectFriendRequest(req: Request, res: Response): Promise<void> {
//     const { requestId } = req.params;
//     const updatedRequest = await friendRequestService.updateFriendRequestStatus(requestId, 'rejected');
//     res.status(HTTP_STATUS.OK).json(updatedRequest);
//   }


  // async sendFriendRequest(req: Request, res: Response): Promise<void> {
  //   const { receiverId } = req.body;
  //   const senderId = req.currentUser!.userId;

  //   try {
  //     const friendRequest = await friendRequestService.createFriendRequest(senderId, receiverId);

  //     // Crear notificación
  //     const notification = await notificationService.sendNotification({
  //       toUserId: receiverId,
  //       fromUserId: senderId,
  //       type: 'friendRequest',
  //       requestId: friendRequest._id.toString(),
  //       message: 'You have a new friend request'
  //     });

  //     res.status(HTTP_STATUS.CREATED).json({ friendRequest, notification });
  //   } catch (error) {
  //     console.error('Error sending friend request:', error);
  //     res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Error sending friend request');
  //   }
  // }

  async sendFriendRequest(req: Request, res: Response): Promise<void> {
    const { receiverId } = req.body;
    const senderId = req.currentUser!.userId;

    try {
      const friendRequest = await friendRequestService.createFriendRequest(senderId, receiverId);

      // Crear notificación
      const notification = await notificationService.sendNotification({
        toUserId: receiverId,
        fromUserId: senderId,
        type: 'friendRequest',
        requestId: friendRequest._id.toString(),
        message: 'You have a new friend request'
      });

      res.status(HTTP_STATUS.CREATED).json({ friendRequest, notification });
    } catch (error) {
      if (error === 'Friend request already sent') {
        res.status(HTTP_STATUS.CONFLICT).json({ message: 'Friend request already sent' });
      } else {
        console.error('Error sending friend request:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Error sending friend request');
      }
    }
  }


  async acceptFriendRequest(req: Request, res: Response): Promise<void> {
    const { requestId } = req.params;

    try {
      const { updatedRequest, senderId, receiverId } = await friendRequestService.updateFriendRequestStatus(requestId, 'accepted');

      // Actualiza los contadores en MongoDB
      await userService.incrementFollowersCount(receiverId);
      await userService.incrementFollowingCount(senderId);

      res.status(HTTP_STATUS.OK).json(updatedRequest);
    } catch (error) {
      console.error('Error al aceptar solicitud de amistad:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Error al procesar la solicitud');
    }
  }

  async rejectFriendRequest(req: Request, res: Response): Promise<void> {
    const { requestId } = req.params;
    try {
      const updatedRequest = await friendRequestService.updateFriendRequestStatus(requestId, 'rejected');
      res.status(HTTP_STATUS.OK).json(updatedRequest);
    } catch (error) {
      console.error('Error al rechazar solicitud de amistad:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Error al rechazar solicitud de amistad');
    }
  }

  async getFriendRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.userId;
      const friendRequests = await friendRequestService.getFriendRequests(userId);
      res.status(200).json(friendRequests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching friend requests', error });
    }
  }

  async cancelFriendRequest(req: Request, res: Response): Promise<void> {
    const { requestId } = req.params;
    try {
      const deletedRequest = await friendRequestService.cancelFriendRequest(requestId);
      res.status(HTTP_STATUS.OK).json({ message: 'Friend request cancelled', request: deletedRequest });
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Error cancelling friend request');
    }
  }




}
