import { setActivePinia, createPinia } from "pinia";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { chatService } from "@/services/chat/chatService";
import { vi } from "vitest";

vi.mock("@/services/chat/chatService", () => ({
  chatService: {
    getThreads: vi.fn(),
    getMessages: vi.fn(),
    deleteThread: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

vi.mock("@/services/auth/authService", () => ({
  authService: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}));

describe("chatStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("startNewThread resets state", () => {
    const store = useChatStore();
    store.activeThreadId = "thread-1";
    store.messages = [{ id: "m1" } as any];
    store.streamingContent = "partial";
    store.error = "some error";

    store.startNewThread();

    expect(store.activeThreadId).toBeNull();
    expect(store.messages).toEqual([]);
    expect(store.streamingContent).toBe("");
    expect(store.error).toBe("");
  });

  it("requiresAuth is true when guest count >= 4 and not authenticated", () => {
    localStorage.setItem("chat_guest_count", "4");
    setActivePinia(createPinia());
    const store = useChatStore();
    // auth store defaults to no session (not authenticated)
    expect(store.requiresAuth).toBe(true);
  });

  it("guestMessagesRemaining decrements correctly", () => {
    localStorage.setItem("chat_guest_count", "2");
    setActivePinia(createPinia());
    const store = useChatStore();
    expect(store.guestMessagesRemaining).toBe(2);
  });

  it("sendMessage adds optimistic user message", async () => {
    const store = useChatStore();

    // Mock sendMessage as an async generator that yields done immediately
    async function* mockStream() {
      yield { type: "done" as const, threadId: undefined };
    }
    vi.mocked(chatService.sendMessage).mockReturnValue(mockStream());

    await store.sendMessage("Hello");

    expect(store.messages.length).toBeGreaterThanOrEqual(1);
    expect(store.messages[0].role).toBe("user");
    expect(store.messages[0].content).toBe("Hello");
  });

  it("deleteThread removes thread from list", async () => {
    const store = useChatStore();
    store.threads = [
      { id: "t1", title: "Thread 1" } as any,
      { id: "t2", title: "Thread 2" } as any,
    ];
    vi.mocked(chatService.deleteThread).mockResolvedValue();

    await store.deleteThread("t1");

    expect(store.threads).toHaveLength(1);
    expect(store.threads[0].id).toBe("t2");
  });

  it("selectThread sets activeThreadId and loads messages", async () => {
    const mockMessages = [
      { id: "m1", thread_id: "t1", role: "user", content: "Hi" },
    ];
    vi.mocked(chatService.getMessages).mockResolvedValue(mockMessages as any);

    const store = useChatStore();
    await store.selectThread("t1");

    expect(store.activeThreadId).toBe("t1");
    expect(store.messages).toEqual(mockMessages);
  });
});
