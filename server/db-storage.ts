import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { users, chats, messages } from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  Chat, 
  InsertChat, 
  Message, 
  InsertMessage 
} from "@shared/schema";
import type { IStorage } from "./storage";
import { hashPassword } from "./auth";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await hashPassword(insertUser.password);
    const result = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword
    }).returning();
    return result[0];
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const result = await db.insert(chats).values(insertChat).returning();
    return result[0];
  }

  async getChats(): Promise<Chat[]> {
    const result = await db.select().from(chats).orderBy(desc(chats.createdAt));
    return result;
  }

  async getChat(id: string): Promise<Chat | undefined> {
    const result = await db.select().from(chats).where(eq(chats.id, id));
    return result[0];
  }

  async updateChatTitle(id: string, title: string): Promise<Chat | undefined> {
    const result = await db
      .update(chats)
      .set({ title })
      .where(eq(chats.id, id))
      .returning();
    return result[0];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(insertMessage).returning();
    return result[0];
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);
    return result;
  }
}
