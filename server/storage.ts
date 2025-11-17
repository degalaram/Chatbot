import { type User, type InsertUser, type Chat, type InsertChat, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";
import { hashPassword } from "./auth";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createChat(chat: InsertChat): Promise<Chat>;
  getChats(): Promise<Chat[]>;
  getChat(id: string): Promise<Chat | undefined>;
  updateChatTitle(id: string, title: string): Promise<Chat | undefined>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(chatId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chats: Map<string, Chat>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.chats = new Map();
    this.messages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    // Hash the password before storing
    const hashedPassword = await hashPassword(insertUser.password);
    const user: User = { ...insertUser, password: hashedPassword, id };
    this.users.set(id, user);
    return user;
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = randomUUID();
    const chat: Chat = { 
      ...insertChat, 
      id,
      createdAt: new Date()
    };
    this.chats.set(id, chat);
    return chat;
  }

  async getChats(): Promise<Chat[]> {
    return Array.from(this.chats.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getChat(id: string): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async updateChatTitle(id: string, title: string): Promise<Chat | undefined> {
    const chat = this.chats.get(id);
    if (!chat) return undefined;
    
    const updatedChat = { ...chat, title };
    this.chats.set(id, updatedChat);
    return updatedChat;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

// Promise-based initialization to ensure single storage instance
// even with concurrent calls
let storagePromise: Promise<IStorage> | null = null;

async function getStorage(): Promise<IStorage> {
  if (!storagePromise) {
    storagePromise = (async () => {
      if (process.env.DATABASE_URL) {
        // Lazy load DatabaseStorage to avoid eager import of db.ts
        const { DatabaseStorage } = await import("./db-storage");
        return new DatabaseStorage();
      }
      return new MemStorage();
    })();
  }
  return storagePromise;
}

// Export storage as an object that delegates to the lazily-initialized instance
// This ensures DATABASE_URL is only checked on first use, preventing crashes
export const storage: IStorage = {
  async getUser(id: string) {
    return (await getStorage()).getUser(id);
  },
  async getUserByUsername(username: string) {
    return (await getStorage()).getUserByUsername(username);
  },
  async createUser(user: InsertUser) {
    return (await getStorage()).createUser(user);
  },
  async createChat(chat: InsertChat) {
    return (await getStorage()).createChat(chat);
  },
  async getChats() {
    return (await getStorage()).getChats();
  },
  async getChat(id: string) {
    return (await getStorage()).getChat(id);
  },
  async updateChatTitle(id: string, title: string) {
    return (await getStorage()).updateChatTitle(id, title);
  },
  async createMessage(message: InsertMessage) {
    return (await getStorage()).createMessage(message);
  },
  async getMessages(chatId: string) {
    return (await getStorage()).getMessages(chatId);
  }
};
