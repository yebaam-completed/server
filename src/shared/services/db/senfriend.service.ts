/* eslint-disable @typescript-eslint/no-explicit-any */
import { FriendRequestModel } from '@root/modules/sendfriend/models/sendfriend.schema';
import mongoose from 'mongoose';

class FriendRequestService {
  async createFriendRequest(senderId: string, receiverId: string) {
    const friendRequest = new FriendRequestModel({
      senderId,
      receiverId,
      status: 'pending'
    });
    await friendRequest.save();
    return friendRequest;
  }

  // async createFriendRequest(senderId: string, receiverId: string) {
  //   const existingRequest = await FriendRequestModel.findOne({
  //     senderId,
  //     receiverId,
  //     status: 'pending'
  //   });

  //   if (existingRequest) {
  //     throw new Error('Friend request already sent');
  //   }

  //   const friendRequest = new FriendRequestModel({
  //     senderId,
  //     receiverId,
  //     status: 'pending'
  //   });
  //   await friendRequest.save();
  //   return friendRequest;
  // }
  // async updateFriendRequestStatus(requestId: string, status: string): Promise<{ updatedRequest: any, senderId: string, receiverId: string }> {
  //   const objectId = new mongoose.Types.ObjectId(requestId);
  //   const updatedRequest = await FriendRequestModel.findByIdAndUpdate(
  //     objectId,
  //     { $set: { status: status } },
  //     { new: true }
  //   ).exec();

  //   if (!updatedRequest) {
  //     throw new Error('Friend request not found');
  //   }

  //   return {
  //     updatedRequest,
  //     senderId: updatedRequest.senderId.toString(),
  //     receiverId: updatedRequest.receiverId.toString()
  //   };
  // }


  // async createFriendRequest(senderId: string, receiverId: string) {
  //   // Verifica si ya existe una solicitud pendiente entre estos usuarios
  //   const existingRequest = await FriendRequestModel.findOne({
  //     senderId,
  //     receiverId,
  //     status: 'pending'
  //   });

  //   if (existingRequest) {
  //     throw new Error('Ya existe una solicitud de amistad pendiente');
  //   }

  //   const friendRequest = new FriendRequestModel({
  //     senderId,
  //     receiverId,
  //     status: 'pending'
  //   });
  //   await friendRequest.save();
  //   return friendRequest;
  // }

  async getFriendRequests(userId: string) {
    return FriendRequestModel.find({ senderId: userId }).populate('receiverId', 'username profilePicture work');
  }

  async updateFriendRequestStatus(requestId: string, status: string): Promise<{ updatedRequest: any, senderId: string, receiverId: string }> {
    const objectId = new mongoose.Types.ObjectId(requestId);
    const updatedRequest = await FriendRequestModel.findByIdAndUpdate(
      objectId,
      { $set: { status: status } },
      { new: true }
    ).exec();

    if (!updatedRequest) {
      throw new Error('Friend request not found');
    }

    return {
      updatedRequest,
      senderId: updatedRequest.senderId.toString(),
      receiverId: updatedRequest.receiverId.toString()
    };
  }

  // async getFriendRequests(userId: string) {
  //   const friendRequests = await FriendRequestModel.find({
  //     $or: [{ senderId: userId }, { receiverId: userId }]
  //   }).populate('senderId', 'username email profilePicture')
  //     .populate('receiverId', 'username email profilePicture')
  //     .exec();

  //   return friendRequests;
  // }

  async cancelFriendRequest(requestId: string) {
    const objectId = new mongoose.Types.ObjectId(requestId);
    const deletedRequest = await FriendRequestModel.findByIdAndDelete(objectId).exec();

    if (!deletedRequest) {
      throw new Error('Friend request not found');
    }

    return deletedRequest;
  }

}

export const friendRequestService = new FriendRequestService();
