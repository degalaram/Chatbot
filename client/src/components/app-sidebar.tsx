import { Plus, MessageSquare, Library, Sparkles, Settings, User, CreditCard, Palette, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Chat = {
  id: string;
  title: string;
  createdAt: Date;
};

type AppSidebarProps = {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
};

export function AppSidebar({
  chats,
  activeChat,
  onNewChat,
  onChatSelect,
}: AppSidebarProps) {
  const navigation = [
    { title: "Library", icon: Library },
    { title: "Explore", icon: Sparkles },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
          data-testid="button-new-chat"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>GPTs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => console.log(`${item.title} clicked`)}
                      data-testid={`button-nav-${item.title.toLowerCase()}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[400px]">
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeChat === chat.id}
                    >
                      <button
                        onClick={() => onChatSelect(chat.id)}
                        data-testid={`button-chat-${chat.id}`}
                        className="w-full"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate">{chat.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              data-testid="button-user-settings"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
                  R
                </div>
                <div className="flex flex-col items-start flex-1">
                  <span className="text-sm font-medium">Ram Degala</span>
                  <span className="text-xs text-muted-foreground">Go</span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2 py-2">
              <User className="h-4 w-4" />
              <span>ramdegala3@gmail.com</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Upgrade plan clicked")}>
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade plan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Personalization clicked")}>
              <Palette className="h-4 w-4 mr-2" />
              Personalization
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Help clicked")}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
              <ChevronRight className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Log out clicked")}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
