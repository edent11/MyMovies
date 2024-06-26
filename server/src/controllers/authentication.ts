import express from 'express'

import { createUser, getUserByUsernameDB } from '../db/user'
import { authentication, random } from '../helpers/helpers'

export const register = async (req: express.Request, res: express.Response) => {

    try {

        const { username, password, avatarImg } = req.body;

        if (!username || !password || !avatarImg)
            return res.status(400).send('No username, password or avatar was provided');

        const existingUser = await getUserByUsernameDB(username);

        if (existingUser) {

            return res.status(400).send('User already exists');
        }

        const salt = random();
        const avatar = `http://localhost:5000/avatars/${avatarImg}`;

        const user = await createUser({
            username,
            avatar,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        await login(req, res);

        return res;


    } catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }

}

export const login = async (req: express.Request, res: express.Response) => {

    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).send('No username or password was provided');

        const user = await getUserByUsernameDB(username).select('+authentication.salt +authentication.password');

        if (!user || !user.authentication) {
            return res.status(400).send('User is not exist');
        }


        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password != expectedHash)
            return res.status(400).send("Password isn't correct");

        const salt = random();

        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        //header
        console.log(user.authentication.sessionToken);

        res.set('session_token', user.authentication.sessionToken);

        //cookie for session
        res.cookie('session_token', user.authentication.sessionToken);

        return res.status(200).json(user).send()

    } catch (error) {
        if (error instanceof Error)
            return res.status(400).send(error.message);
    }

}

