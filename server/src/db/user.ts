import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { authentication, random } from "../helpers/helpers";
import { checkIfNotificationReadDB, getNotificationDB } from "./notification";
import { Notification } from "../db/notification"



export interface User {
    username: string;
    avatar: string
}



const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    authentication: {

        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
        sessionToken: { type: String, required: false, select: false },
    },

    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notifications', select: false }]

});



export const UserModel = mongoose.model('Users', userSchema);

export const getUsers = () => UserModel.find();

export const getOtherUsers = (query: any) => UserModel.find(query);


export const getUserByUsernameDB = (username: string) => UserModel.findOne({ 'username': username });

export const addNotification = (uid: ObjectId | mongoose.Schema.Types.ObjectId, notificationId: ObjectId) => UserModel.updateOne({ _id: uid },
    { $push: { notifications: notificationId } });

export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });

export const getUserIDByUsername = (username: string) => UserModel.findOne({ 'username': username }).select('_id');


export const getUserById = (uid: string) => UserModel.findById(uid);

export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());

export const deleteUserById = (uid: string) => UserModel.findOneAndDelete({ _id: uid });

export const updateUserById = (uid: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(uid, values);


// export const getUserNotificationsDB = (uid: ObjectId) => UserModel.findById(uid).select("notifications").populate("notifications").populate("notifications.sender")

export const getUserNotificationsDB = (userID: ObjectId): Promise<Number> => UserModel.aggregate([

    { $match: { _id: userID } },

    // Unwind the notifications array
    { $unwind: "$notifications" },

    // Lookup to populate sender information for each notification
    {
        $lookup: {
            from: 'notifications',
            localField: 'notifications',
            foreignField: '_id',
            as: 'notification'
        }
    },

    // Unwind the notification array to work with individual notifications
    { $unwind: "$notification" },

    // Lookup to populate sender information
    {
        $lookup: {
            from: "users",
            localField: "notification.sender",
            foreignField: "_id",
            as: "sender"
        }
    },

    // Unwind the sender array to work with individual sender documents
    { $unwind: "$sender" },

    // Project specific fields from sender and notification
    {
        $project: {
            "_id": "$notification._id",
            "sender": {
                "username": "$sender.username",
                "avatar": "$sender.avatar",
            },
            "timestamp": "$notification.timestamp",
            "type": "$notification.type",
            "thoughtID": "$notification.thoughtID",
            "commentID": "$notification.commentID",
            "wasRead": "$notification.wasRead",
        }
    }






]).then((result) => result)
    .catch(error => error);

export const getUnReadNotificationsCountDB = (userID: ObjectId): Promise<number> => UserModel.findById(userID).select('notifications')
    .then(async (user) => {
        if (!user) {
            throw new Error('User not found');
        }

        var count: number = 0;

        await Promise.all(user.notifications.map(async (notificationId) => {

            const isRead: boolean = await checkIfNotificationReadDB(notificationId);

            return !isRead ? count++ : null;
        }));

        return count;
    })

