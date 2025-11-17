import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUp, Paperclip, Mic, Lightbulb, BookOpen, Image, Radio, MoreHorizontal, ChevronRight } from "lucide-react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Message ChatGPT",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Files selected:", files);
      // Handle file upload logic here
    }
  };

  const handleVoiceClick = () => {
    console.log("Voice input clicked");
  };


  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 rounded-2xl border bg-background p-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,application/pdf,.doc,.docx,.txt"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                data-testid="button-attach"
                onClick={() => console.log("Attach clicked")} // This onClick will not be triggered if DropdownMenuTrigger is used
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={handleFileUpload}>
                <Paperclip className="mr-2 h-4 w-4" />
                Add photos & files
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Radio className="mr-2 h-4 w-4" />
                Deep research
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Image className="mr-2 h-4 w-4" />
                Create image
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Lightbulb className="mr-2 h-4 w-4" />
                Thinking
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BookOpen className="mr-2 h-4 w-4" />
                Study and learn
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MoreHorizontal className="mr-2 h-4 w-4" />
                <span className="flex-1">More</span>
                <ChevronRight className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[24px] max-h-[200px] resize-none border-0 p-0 focus-visible:ring-0 text-base"
            rows={1}
            data-testid="input-message"
          />

          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-voice"
              onClick={handleVoiceClick}
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={disabled || !message.trim()}
              className="rounded-full"
              data-testid="button-send"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          ChatGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}