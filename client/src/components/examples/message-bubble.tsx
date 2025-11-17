import { MessageBubble } from "../message-bubble";
import { ThemeProvider } from "../theme-provider";

export default function MessageBubbleExample() {
  return (
    <ThemeProvider>
      <div className="space-y-0">
        <MessageBubble
          role="user"
          content="What is the capital of France?"
        />
        <MessageBubble
          role="assistant"
          content="The capital of France is Paris. It's one of the most visited cities in the world and is known for its art, fashion, gastronomy, and culture."
        />
      </div>
    </ThemeProvider>
  );
}
