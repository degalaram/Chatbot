import { useState } from "react";
import { AppSidebar } from "../app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "../theme-provider";

export default function AppSidebarExample() {
  const [activeChat, setActiveChat] = useState("1");
  
  const mockChats = [
    { id: "1", title: "Mid-level developer role", createdAt: new Date() },
    { id: "2", title: "Open link in incognito", createdAt: new Date() },
    { id: "3", title: "Fix link not opening", createdAt: new Date() },
    { id: "4", title: "Fix Microsoft chat issues", createdAt: new Date() },
    { id: "5", title: "Extract link", createdAt: new Date() },
  ];

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar
            chats={mockChats}
            activeChat={activeChat}
            onNewChat={() => console.log("New chat")}
            onChatSelect={setActiveChat}
          />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
