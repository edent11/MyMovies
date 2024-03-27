import mongoose from "mongoose";
import { embeddedUserSchema } from "./user";



const thoughtSchema = new mongoose.Schema({

    user: {
        type: embeddedUserSchema,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    content: {
        header: { type: String, required: true },
        body: { type: String, required: true },
        imageSource: { type: String, required: false },
    },
    comments: [{
        author: {
            type: embeddedUserSchema
        },
        text: {
            type: String,
            required: true
        }

    }],
    likes: {
        type: Number,
        default: 0
    }



});

export const ThoughtsModel = mongoose.model('thoughts', thoughtSchema);

export const getThoughts = () => ThoughtsModel.find();

export const getThoughtsByUsername = (username: string) => ThoughtsModel.findOne({ 'user.username': username });

// export const getThoughtByKeyword = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });

export const getThoughtById = (tid: string) => ThoughtsModel.findById(tid);


export const createThought = (values: Record<string, any>) => new ThoughtsModel(values)
    .save().then((thought) => thought.toObject());


// export const deleteUserById = (uid: string) => UserModel.findOneAndDelete({ _id: uid });

// export const updateUserById = (uid: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(uid, values);