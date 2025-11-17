import { ChatInput } from "../chat-input";
import { ThemeProvider } from "../theme-provider";

export default function ChatInputExample() {
  return (
    <ThemeProvider>
      <div className="h-screen flex items-end">
        <ChatInput onSend={(msg) => console.log("Message sent:", msg)} />
      </div>
    </ThemeProvider>
  );
}
