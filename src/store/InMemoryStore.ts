import { Chat, Store, UserId } from "./Store";
let globalChatId = 0;

export interface Room {
  roomId: string;
  chats: {
    [key: string]: Chat;
  };
}

export class InMemoryStore implements Store {
  private store: Map<string, Room>;

  constructor() {
    this.store = new Map<string, Room>();
  }

  initRoom(roomId: string) {
    this.store.set(roomId, {
      roomId,
      chats: {},
    });
  }

  getChats(roomId: string, limit: number, offset: number) {
    const room = this.store.get(roomId);
    if (!room) {
      return [];
    }
    // Find out if there is a better way to do this.
    return Object.values(room.chats)
      .reverse()
      .slice(0, offset)
      .slice(-1 * limit);
  }

  addChat(userId: UserId, name: string, roomId: string, message: string) {
    if (!this.store.get(roomId)) {
      this.initRoom(roomId);
    }
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }
    const chat = {
      id: (globalChatId++).toString(),
      userId,
      name,
      message,
      upvotes: [],
    };
    room.chats[chat.id] = chat;
    return chat;
  }

  upvote(userId: UserId, roomId: string, chatId: string) {
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }

    const chat = room.chats[chatId];

    if (chat) {
      if (chat.upvotes.find((x) => x === userId)) {
        return chat;
      }
      chat.upvotes.push(userId);
    }
    return chat;
  }
}
