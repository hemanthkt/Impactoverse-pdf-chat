import React, { useState } from "react";

const ChatSection = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [parsedContent, setParsedContent] = useState("");

  //Handle parsed data
  const handleParsePdf = async () => {
    if (!pdfFile) {
      alert("Please upload a pdf");
      return;
    }
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-pdf", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Falied to parse PDF");
      }
      const data = await response.json();
      console.log("Received data", data);
      setParsedContent(data.parsed_content);
      console.log(parsedContent);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      console.log("PDF uploaded:", file.name);
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      console.log("PDF uploaded via drag and drop:", file.name);
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChat((prev) => [...prev, { text: message, sender: "user" }]);
      try {
        const response = await fetch("http://127.0.0.1:8000/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: message,
            context: parsedContent,
          }),
        });
        if (!response.ok) throw new Error("Failed to get answer");

        const data = await response.json();
        setChat((prev) => [...prev, { text: data.answer, sender: "ai" }]);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
      setMessage("");
    }
  };

  // Function to handle text area auto-resize
  const handleTextareaResize = (e) => {
    e.target.style.height = "auto"; // Reset height to auto before resizing
    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on scroll height
  };

  return (
    <div className="chat-section max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Chat with the PDF</h2>

      {/* Upload PDF Section */}
      <div
        className="upload-pdf mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="mb-2 text-gray-600">Drag & Drop PDF here or</p>
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-blue-500 hover:underline"
        >
          Click to upload PDF
        </label>
        <button
          className="mx-5 cursor-pointer text-blue-500 hover:underline"
          onClick={handleParsePdf}
        >
          Parse PDF
        </button>
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        {pdfFile && (
          <p className="mt-2 text-sm text-gray-600">
            Uploaded PDF: {pdfFile.name}
          </p>
        )}
      </div>

      {/* Chat Box */}
      <div className="chat-box bg-gray-100 p-4 mb-4 border border-gray-300 rounded-lg max-h-[300px] overflow-y-auto">
        {chat.map((msg, index) => (
          <div
            key={index}
            className="p-2 bg-white mb-2 rounded overflow-y-auto shadow-sm"
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>{" "}
            {/* Added whitespace-pre-wrap */}
          </div>
        ))}
      </div>

      {chat.map((msg, index) => (
        <div
          key={index}
          className={`p-2 mb-2 rounded ${
            msg.sender === "user"
              ? "bg-blue-100 ml-auto"
              : "bg-gray-100 mr-auto"
          }`}
        >
          <p className="whitespace-pre-wrap">{msg.text}</p>
        </div>
      ))}

      {/* Input Section */}
      <div className="input-section flex flex-col sm:flex-row sm:items-center">
        {/* Textarea for multi-line input */}
        <textarea
          value={message}
          onChange={handleMessageChange}
          onInput={handleTextareaResize}
          className="p-3 flex-1 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 sm:mb-0 sm:mr-2 resize-none"
          placeholder="Ask something..."
          rows={1} // Start with one row
        />
        <button
          onClick={handleSendMessage}
          className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
