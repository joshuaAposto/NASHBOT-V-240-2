const axios = require("axios");

module.exports = {
    name: "claude",
    description: "Interact with Claude-Sonnet 3.5 model",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["claude"],
    async execute(api, event, args, prefix) {
        const { threadID, messageID } = event;
        const prompt = args.join(" ");
        
        if (!prompt) {
            return api.sendMessage("Please enter a prompt.", threadID, messageID);
        }

        global.handle = global.handle || { replies: {} };

        api.sendMessage("[ Claude-Sonnet 3.5 ]\n\nPlease wait...", threadID, (err, info) => {
            if (err) return;

            axios.get(`${global.NashBot.JOSHUA}blackbox/model/claude-sonnet-3.5?prompt=${encodeURIComponent(prompt)}`)
                .then(response => {
                    const reply = response.data.response || "No response available.";
                    api.editMessage(
                        `[ Claude-Sonnet 3.5 ]\n\n${reply}`,
                        info.messageID
                    );
                    global.handle.replies[info.messageID] = {
                        cmdname: module.exports.name,
                        this_mid: info.messageID,
                        this_tid: info.threadID,
                        tid: threadID,
                        mid: messageID,
                    };
                })
                .catch(error => {
                    console.error("Error fetching data:", error.message);
                    api.editMessage("Failed to fetch data. Please try again later.", info.messageID);
                });
        }, messageID);
    },
};
