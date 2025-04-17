'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { markdownToHtml } from '@/lib/utils';
import _ from 'lodash';
// import aiIcon from '@/public/ai-icon.svg';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, stop, status, error } = useChat();

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [htmlMessages, setHtmlMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    // 将所有消息的 Markdown 转换为 HTML
    let isSet = true;
    const convertMessages = async () => {
      const convertedMessages: Record<string, string> = _.fromPairs(
        await Promise.all(
          messages.map(async (m) => [m.id, await markdownToHtml(m.content)])
        )
      );
      if (!isSet) return;
      setHtmlMessages(convertedMessages);
    };

    console.log(messages);
    convertMessages();
    return () => {
      isSet = false;
    };
  }, [messages]);

  return (
    <div className=" 
      relative 
      w-full h-full 
      bg-white 
      overflow-auto custom-scrollbar
    ">
      <div className="
        m-auto
        w-3xl pb-20
        flex flex-col 
      ">
        {/* Header */}
        <div className="border-b border-gray-300 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-800">AI Chat</h1>
          <p className="text-sm text-gray-500">Chat with your AI assistant</p>
        </div>

        {/* Messages */}
        <div className="
          px-6 py-4 
          space-y-6
        ">
          {messages.map((m) => (
            <div
              key={m.id}
              className="
                p-4 rounded-md
                flex items-start gap-4
                transition-all duration-200 
              "
            >
              {/* icon */}
              <div className="flex-shrink-0">
                <div className="
                    w-10 h-10 p-0 rounded-full custom-border
                    flex items-center justify-center
                  ">
                  <Image
                    src={m.role === "user" ? "/user-icon.svg" : "/ai-icon.svg"}
                    alt={m.role === "user" ? "User" : "AI"}
                    width={24}
                    height={24}
                  />
                </div>
              </div>

              {/* 消息内容 */}
              <div className="flex-1">
                <div
                  className="
                    mt-2 
                    text-sm text-gray-800 
                    whitespace-pre-wrap
                  "
                  dangerouslySetInnerHTML={{ __html: htmlMessages[m.id] || '' }}
                />
                <div className="mt-2">
                  {m?.experimental_attachments
                    ?.filter((attachment) =>
                      attachment?.contentType?.startsWith('image/')
                    )
                    .map((attachment, index) => (
                      <Image
                        key={`${m.id}-${index}`}
                        src={attachment.url}
                        width={300}
                        height={300}
                        alt={attachment.name ?? `attachment-${index}`}
                        className="
                          rounded-lg 
                          border border-gray-300 
                          hover:shadow-md
                        "
                      />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        className="
          fixed bottom-0 left-0 right-0 
          bg-white 
          border-t border-gray-300 
          px-6 py-4 
          flex items-center space-x-4
        "
        onSubmit={(event) => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          className="hidden"
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="
            px-4 py-2 
            bg-gray-200 text-gray-700 
            rounded-lg 
            cursor-pointer 
            hover:bg-gray-300 hover:shadow-md
          "
        >
          Upload Files
        </label>
        <input
          className="
            flex-1 
            p-2 
            border border-gray-300 
            rounded-lg 
            text-sm text-gray-800 
            focus:outline-none focus:ring-2 focus:ring-gray-400
          "
          value={input}
          placeholder="Type your message..."
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          className="
            px-4 py-2 
            bg-gray-800 text-white 
            rounded-lg 
            hover:bg-gray-900 hover:shadow-md
          "
        >
          Send
        </Button>
      </form>
    </div>
  );
}