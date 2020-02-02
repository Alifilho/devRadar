const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

//index, show, store, update, destroy

module.exports = {
    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = github_username, avatar_url, bio } = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return res.json(dev);
    }, 

    async destroy(req, res) {
        const { github_username } = req.body;

        let dev = await Dev.findOne({ github_username });
        
        if(dev) {
            await Dev.deleteOne({
                github_username
            });

            let devAfter = await Dev.findOne({ github_username });

            if(!devAfter) {
                return res.json({ message: "Usuario Excluido" });
            } else {
                return res.json({ message: "Erro ao excluir usuario" });
            }
        } else {
            return res.json({ message: "Usuario não encontrado" });
        }
    },

    async update(req, res) {

        res.send('OK');
    }
};