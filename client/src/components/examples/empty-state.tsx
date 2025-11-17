import { EmptyState } from "../empty-state";
import { ThemeProvider } from "../theme-provider";

export default function EmptyStateExample() {
  return (
    <ThemeProvider>
      <div className="h-screen">
        <EmptyState />
      </div>
    </ThemeProvider>
  );
}
