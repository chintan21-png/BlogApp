const axios = require('axios');
const {
    blogPostIdeasPrompt,
    generateReplyPrompt,
    blogSummaryPrompt,
} = require("../utils/prompts");

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

// Helper function for Cerebras API calls
const queryCerebras = async (prompt, model = "llama-3.3-70b") => {
    try {
        const response = await axios.post(
            "https://api.cerebras.ai/v1/chat/completions",
            {
                model: model,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        
        return response.data.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Cerebras API error:", error.message);
        throw error;
    }
};

const generateBlogPost = async(req,res) => {
    try{
        const {title, tone} = req.body;

        if(!title || !tone) {
            return res.status(400).json({message: "Missing required fields"});
        }
        
        const prompt = `Write a markdown-formatted blog post titled "${title}". Use a ${tone} tone. Include an introduction, subheadings, code examples if relevant, and a conclusion.`;
        
        const response = await queryCerebras(prompt, "llama-3.3-70b");
        res.status(200).json(response);
    }
    catch(err) {
        res.status(500).json({message: "Failed to generate blog post", error: err.message});
    }
};

const generateBlogPostIdeas = async(req,res) => {
    try{
        const { topics } = req.body;

        if (!topics) {
            return res.status(400).json({ message: "Topic is required" });
        }

        const prompt = blogPostIdeasPrompt(topics);
        const response = await queryCerebras(prompt, "llama-3.3-70b");
        
        const rawText = response;
        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();
        
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    }
    catch(err) {
        res.status(500).json({message:"Failed to generate blog post ideas !", error: err.message});
    }
};

const generateCommentReply = async(req,res) => {
    try {
        const {author, content} = req.body;

        if(!content) {
            return res.status(400).json({message:"Missing required fields"})
        }

        const prompt = generateReplyPrompt({author, content});
        const response = await queryCerebras(prompt, "llama-3.3-70b");
        res.status(200).json(response);
    }
    catch(err) {
        res.status(500).json({message: "Failed to generate comment reply", error: err.message});
    }
};

const generatePostSummary = async(req,res) => {
    try {
        const {content} = req.body;

        if(!content) {
            return res.status(400).json({message:"Missing required fields"});
        }
        
        const prompt = blogSummaryPrompt(content);
        const response = await queryCerebras(prompt, "llama-3.3-70b");
        
        const rawText = response;
        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();
        
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    }
    catch(err) {
        res.status(500).json({message: "Failed to generate post summary", error: err.message});
    }
};

module.exports = {
    generateBlogPost,
    generateBlogPostIdeas,
    generateCommentReply,
    generatePostSummary,
};