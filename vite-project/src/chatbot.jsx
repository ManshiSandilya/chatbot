import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleClick = async () => {
    if (input.trim() === "") return;
    setIsActive(true);

    setMessages([...messages, { text: input, role: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": "<YOUR_SITE_URL>",
          "X-Title": "<YOUR_SITE_NAME>",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1:free",
          "messages": [
            {
              "role": "system",
              "content": "You are AI Creative Writing Coach that helps writers brainstorm story ideas. If the query is not related to writers brainstorm story ideas,   respond with: 'I apologize, but I can only help you with writers brainstorm story ideas. Please ask me about writers brainstorm story ideas!'"
            },
            {
              "role": "user",
              "content": input
            }
          ]
        })
      });

      const data = await response.json();
      console.log(data);

      const botReply = { text: data.choices[0].message.content, role: 'bot' }
      setMessages((prevmessages) => { return [...prevmessages, botReply] });
    }

    catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prevmessages) => { 
        return [...prevmessages, { text: "Sorry, I encountered an error. Please try again.", role: 'bot' }] 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  }


  const copyToClipboard = (e) => {
    const img1 = e.currentTarget.querySelector("#img1");
    const img2 = e.currentTarget.querySelector("#img2");
  
    img1.style.display = "none";  
    img2.style.display = "block"; 
  
    navigator.clipboard.writeText(e.currentTarget.parentElement.innerText);
  
    setTimeout(() => {
      img1.style.visibility = "hidden";
      img2.style.display = "visible";
    }, 2000);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#212121]">
      <nav className="fixed w-full h-20 flex items-center justify-between px-5">
        <div>
          <ul className="flex justify-between items-center gap-5">
            <li>
              <img src="../../sidebar.jpg" alt="sidebar" className="object-contain w-6 h-6 filter invert-[88%] sepia-[6%] saturate-[303%] hue-rotate-183 brightness-[89%] contrast-[87%]"
              />
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <img
                  src="../../chatbot.jpg"
                  alt="AI Bot"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h4 className="font-bold text-xl text-gray-300">AI Creative Writing Coach</h4>
            </li>
          </ul>
        </div>
        <div>
          <img src="../user-244.png" alt="user" className="w-10 h-10 invisible" />
        </div>
      </nav>

      <div className="w-full flex flex-col items-center p-16 pb-40 pt-40 overflow-auto">
        <div className="flex flex-col w-[50%] space-y-3">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`p-3 break-words whitespace-pre-wrap rounded-lg ${msg.role === "user"
                ? "bg-[#383838] text-white self-end max-w-[70%]"
                : "bg-[#1b1b1b] text-white self-start max-w-full"
                }`}
            >
              {msg.text}
                
              <button className="relative flex justify-center items-center" onClick={copyToClipboard}>
                <img
                  id="img1"
                  src="../../copy.jpg"
                  alt=""
                  className="object-contain w-4 h-4 filter invert-[88%] sepia-[6%] saturate-[303%] hue-rotate-183 brightness-[89%] contrast-[87%]"
                />
                <img
                  id="img2"
                  src="../icons8-tick-48.png"
                  alt=""
                  className="absolute object-contain w-4 h-4 filter invert-[88%] sepia-[6%] saturate-[303%] hue-rotate-183 brightness-[89%] contrast-[87%]"
                  style={{ visibility: "hidden" }} 
                />
              </button>
            </div>
          ))}
          
          {/* Loading animation */}
          {isLoading && (
            <div className="p-3 break-words whitespace-pre-wrap rounded-lg bg-[#1b1b1b] text-white self-start max-w-full">
              <div className="flex items-center gap-2">
                <img 
                  src="../../chatbot.jpg" 
                  alt="Bot" 
                  className="w-6 h-6 object-contain" 
                />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={`fixed ${!isActive ? "top-[30%]" : "bottom-0"} left-0 w-full p-3`}>
        <div className="flex flex-col items-center gap-10">
          {!isActive && <h1 className="text-4xl font-extrabold text-gray-300">What can I help you with?</h1>}

          <div className="relative w-[50%] border border-gray-600 rounded-2xl bg-gray-300">
            <textarea
              className="w-full h-20 border-none bg-transparent placeholder-black focus:outline-none resize-none rounded-2xl p-3"
              placeholder="Ask anything..."
              value={input}
              onChange={handleChange}
              onKeyDown={handleEnter}
              name="input"
            ></textarea>

            <div className="absolute bottom-3 right-3 flex gap-2">
              <button className="bg-white hover:bg-gray-300 p-2 rounded-lg text-gray-600">
                🔍
              </button>
              <button className="bg-white hover:bg-gray-300 text-white p-2 rounded-lg" onClick={handleClick}>
                ➕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;


// 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