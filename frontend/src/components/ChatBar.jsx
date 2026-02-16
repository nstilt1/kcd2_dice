"use client";

import React, { useState, useRef, useEffect, textInput } from 'react';
import '../styles/ChatBar.css';

const ChatBar = ({ onSubmit, onTextChange, fileInputRef, textInput }) => {
    const [fileAttached, setFileAttached] = useState(false);
    const textareaRef = useRef(null);

    const handleTextChange = (event) => {
        onTextChange(event);
    };

    const handleFileChange = (e) => {
        if (fileInputRef.current.files.length > 0) {
            setFileAttached(true);
        } else {
            onFileChange(null);
        }
    };

    const handleClearFile = () => {
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFileAttached(false);
    };

    const handleFileButtonClick = (e) => {
        e.preventDefault();
        if (fileAttached) {
            handleClearFile();
            console.log("cleared the file");
            console.log(fileInputRef.current.files);
        } else {
            document.getElementById('fileUpload').click();
            console.log("set the file");
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(event);
    };

    const handleKeyDown = (e) => {
        // Submit form when Enter key is pressed, but not when Shift+Enter
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [textInput]);

    return (
      <div className="flex items-center border rounded-lg p-2 bg-white mb-4">

        {/* Text input area */}
        <textarea
          value={textInput}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
          className="flex-grow resize-none h-auto max-h-40 p-2 border-none focus:ring-0 focus:outline-none overflow-auto thin-scrollbar"
          placeholder="Simulation seed text (example: 'test seed')"
          rows={1}
          style={{ minHeight: '40px' }} // Ensure initial height
        />

        {/* Send/Submit button */}
        <button
          className="p-2 focus:outline-none bg-black text-white rounded-full"
          onClick={handleSubmit}
          type="submit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
};

export default ChatBar;
