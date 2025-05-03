const { getChatResponse } = require('../utils/geminiChatBot');

const askChatbot = async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await getChatResponse(message);
        res.json({ response });
    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({ 
            error: 'Something went wrong with the chatbot service',
            details: error.message 
        });
    }
};

module.exports = {
    askChatbot
};
