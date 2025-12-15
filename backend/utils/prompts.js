const blogPostIdeasPrompt = (topic) => `
    Generate a list of 5 blog post ideas related to ${topic}.

For each blog post ideas, return:
- a title
- a 2-line description about the post
- 3 relevent tags
- the tone (e.g., technical, casual, beginner-friendly, etc.)

Return the result as an array of JSON objects in this format:
[
   {
      "title": "",
      "description": "",
      "tags": ["", "", ""],
      "tone": ""
   }
]
Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;

function generateReplyPrompt(comment) {
  const authorName = comment.author?.name || "User";
  const content = comment.content;

  return `You're replying to a blog comment by ${authorName}. The comment says:
    "${content}"
    
    Write a thoughful, concise, and relevant reply to this comment.`;
}

const blogSummaryPrompt = (blogContent) => `
You are a backend JSON API.

RULES (VERY IMPORTANT):
- Return ONLY valid JSON
- Do NOT use markdown formatting
- Do NOT use raw newlines
- Use \\n for line breaks inside strings
- Escape all quotes properly

JSON format:
{
  "title": "string",
  "summary": "string"
}

The summary must:
- Be about 300 words
- End with a section titled: What You'll Learn
- Include 3 to 5 bullet points using hyphens (-)

Blog content:
${blogContent}
`;
module.exports = {
  blogPostIdeasPrompt,
  generateReplyPrompt,
  blogSummaryPrompt,
};
