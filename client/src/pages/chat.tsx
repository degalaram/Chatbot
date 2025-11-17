import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MessageBubble } from "@/components/message-bubble";
import { ChatInput } from "@/components/chat-input";
import { EmptyState } from "@/components/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Chat, Message } from "@shared/schema";

type ChatWithMessages = Chat & {
  messages: Message[];
};

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch all chats with proper loading and error handling
  const { 
    data: chats = [], 
    isLoading: isLoadingChats,
    error: chatsError 
  } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
  });

  // Fetch messages for active chat with proper loading and error handling
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    error: messagesError 
  } = useQuery<Message[]>({
    queryKey: ["/api/chats", activeChat, "messages"],
    enabled: !!activeChat,
  });

  // Show error toasts for query failures
  useEffect(() => {
    if (chatsError) {
      toast({
        title: "Error loading chats",
        description: chatsError instanceof Error ? chatsError.message : "Failed to load chat history",
        variant: "destructive",
      });
    }
  }, [chatsError, toast]);

  useEffect(() => {
    if (messagesError) {
      toast({
        title: "Error loading messages",
        description: messagesError instanceof Error ? messagesError.message : "Failed to load messages",
        variant: "destructive",
      });
    }
  }, [messagesError, toast]);

  // Create new chat mutation
  const createChatMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/chats", { title: "New chat" });
      return await res.json() as Chat;
    },
    onSuccess: (newChat: Chat) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      setActiveChat(newChat.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create new chat",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }: { chatId: string; content: string }) => {
      const res = await apiRequest("POST", `/api/chats/${chatId}/messages`, { role: "user", content });
      return await res.json() as { userMessage: Message; assistantMessage: Message };
    },
    onMutate: async ({ chatId, content }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["/api/chats", chatId, "messages"] });

      // Snapshot the previous messages
      const previousMessages = queryClient.getQueryData<Message[]>(["/api/chats", chatId, "messages"]);

      // Generate unique temp ID for this specific mutation
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      // Optimistically update to the new value
      const optimisticUserMessage: Message = {
        id: tempId,
        chatId,
        role: "user",
        content,
        createdAt: new Date(),
      };

      queryClient.setQueryData<Message[]>(
        ["/api/chats", chatId, "messages"],
        (old = []) => [...old, optimisticUserMessage]
      );

      return { previousMessages, tempId };
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic message in place to preserve chronological order
      queryClient.setQueryData<Message[]>(
        ["/api/chats", variables.chatId, "messages"],
        (old = []) => {
          // Find the index of the temporary message
          const tempIndex = old.findIndex(msg => msg.id === context.tempId);
          
          if (tempIndex === -1) {
            // Temp message not found (shouldn't happen), append at end
            return [...old, data.userMessage, data.assistantMessage];
          }
          
          // Replace temp message with real user message and insert assistant reply right after
          const updated = [...old];
          updated[tempIndex] = data.userMessage;
          updated.splice(tempIndex + 1, 0, data.assistantMessage);
          
          return updated;
        }
      );
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: (error: Error, variables, context) => {
      // Revert to previous state on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["/api/chats", variables.chatId, "messages"],
          context.previousMessages
        );
      }
      
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleNewChat = () => {
    createChatMutation.mutate();
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat) {
      const newChat = await createChatMutation.mutateAsync();
      sendMessageMutation.mutate({ chatId: newChat.id, content });
      return;
    }

    sendMessageMutation.mutate({ chatId: activeChat, content });
  };

  const chatsWithMessages: ChatWithMessages[] = chats.map((chat) => ({
    ...chat,
    messages: [],
  }));

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          chats={chatsWithMessages}
          activeChat={activeChat}
          onNewChat={handleNewChat}
          onChatSelect={setActiveChat}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-3 border-b shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold">
                ChatGPT <span className="text-muted-foreground font-normal">5.1</span>
              </h1>
            </div>
            <ThemeToggle />
          </header>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {isLoadingMessages && activeChat ? (
              <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ) : !activeChat || messages.length === 0 ? (
              <EmptyState />
            ) : (
              <ScrollArea ref={scrollAreaRef} className="flex-1">
                <div className="max-w-3xl mx-auto">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      role={message.role as "user" | "assistant"}
                      content={message.content}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
            
            <ChatInput
              onSend={handleSendMessage}
              disabled={sendMessageMutation.isPending || createChatMutation.isPending}
              placeholder={sendMessageMutation.isPending ? "ChatGPT is thinking..." : "Message ChatGPT"}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
