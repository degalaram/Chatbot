import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatSchema, insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all chats
  app.get("/api/chats", async (_req, res) => {
    try {
      const chats = await storage.getChats();
      res.json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ 
        error: "Internal server error while fetching chats" 
      });
    }
  });

  // Create a new chat
  app.post("/api/chats", async (req, res) => {
    try {
      const validatedData = insertChatSchema.parse(req.body);
      const chat = await storage.createChat(validatedData);
      res.json(chat);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation error",
          details: error.errors 
        });
      }
      console.error("Error creating chat:", error);
      res.status(500).json({ 
        error: "Internal server error while creating chat" 
      });
    }
  });

  // Get messages for a chat
  app.get("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const { chatId } = req.params;
      const messages = await storage.getMessages(chatId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ 
        error: "Internal server error while fetching messages" 
      });
    }
  });

  // Send a message and get AI response
  app.post("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const { chatId } = req.params;
      
      // Validate request body
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        chatId,
      });

      // Save user message
      const userMessage = await storage.createMessage(validatedData);

      // Get chat history for context
      const messages = await storage.getMessages(chatId);
      
      // Generate AI response
      let aiResponse: string;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant. Always provide concise, one-line answers. Keep responses brief and to the point, answering only what was asked without elaboration. If asked about current events or information after your knowledge cutoff date, clearly state that your information may be outdated and recommend the user verify current information from reliable sources."
            },
            ...messages.map(msg => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            }))
          ],
        });

        aiResponse = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
      } catch (openaiError: any) {
        console.error("OpenAI API error:", openaiError);
        
        // Provide more specific error messages
        if (openaiError.status === 429) {
          return res.status(429).json({ 
            error: "Rate limit exceeded. Please try again in a moment." 
          });
        } else if (openaiError.status === 401) {
          return res.status(500).json({ 
            error: "API authentication failed. Please check your OpenAI API key configuration." 
          });
        } else {
          return res.status(500).json({ 
            error: `AI service error: ${openaiError.message || 'Failed to generate response'}` 
          });
        }
      }

      // Save AI response
      const assistantMessage = await storage.createMessage({
        chatId,
        role: "assistant",
        content: aiResponse,
      });

      // Update chat title if it's the first message
      if (messages.length === 1) {
        const title = validatedData.content.slice(0, 50);
        await storage.updateChatTitle(chatId, title);
      }

      res.json({
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation error",
          details: error.errors 
        });
      }
      
      console.error("Error processing message:", error);
      res.status(500).json({ 
        error: "Internal server error while processing message" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
