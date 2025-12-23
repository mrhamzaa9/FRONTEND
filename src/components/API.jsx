import React, { useEffect, useState } from 'react'
import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic({ 
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const API = () => {
    const [apiResponse, setApiResponse] = useState(""); // Initialize as empty string
    const [input, setInput] = useState("hey")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await claude.messages.create({ 
                    model: import.meta.env.VITE_CLAUDE_MODEL , // Added fallback
                    max_tokens: 300, 
                    temperature: 0.5,
                    messages: [{ role: "user", content: input }] 
                });
                
                console.log(response);
                
                // --- THE FIX IS HERE ---
                // We access .content[0].text to get the actual string
                if (response.content && response.content.length > 0) {
                    setApiResponse(response.content[0].text);
                }
                
            } catch (error) {
                setApiResponse(`Error: ${error.message}`);
            }
        };

        fetchData();

    }, [])

  return (
    <div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
        <h1>API Component</h1>
        {/* Now this is safe because apiResponse is a string */}
        <p style={{ whiteSpace: 'pre-wrap' }}>Response: {apiResponse}</p>
    </div>
  )
}

export default API