import { Sparkles } from "lucide-react";

export function EmptyState() {
  const suggestions = [
    "Explain quantum computing in simple terms",
    "Help me plan a trip to Japan",
    "Write a Python function to sort a list",
    "What are the latest AI trends?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-semibold">What's on your mind today?</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="p-4 text-left rounded-lg border bg-card hover-elevate active-elevate-2 transition-colors"
              onClick={() => console.log("Suggestion clicked:", suggestion)}
              data-testid={`button-suggestion-${index}`}
            >
              <p className="text-sm">{suggestion}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
