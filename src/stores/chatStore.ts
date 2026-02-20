import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  chatService,
  type ChatThread,
  type ChatMessage,
} from "@/services/chat/chatService";
import { useAuthStore } from "@/stores/authStore";

const GUEST_LIMIT = 4;
const GUEST_COUNT_KEY = "chat_guest_count";

function loadGuestCount(): number {
  const stored = localStorage.getItem(GUEST_COUNT_KEY);
  return stored ? parseInt(stored, 10) || 0 : 0;
}

export const useChatStore = defineStore("chat", () => {
  const threads = ref<ChatThread[]>([]);
  const activeThreadId = ref<string | null>(null);
  const messages = ref<ChatMessage[]>([]);
  const streamingContent = ref("");
  const isStreaming = ref(false);
  const isLoadingThreads = ref(false);
  const isLoadingMessages = ref(false);
  const error = ref("");
  const guestMessageCount = ref(loadGuestCount());

  const activeThread = computed(() =>
    threads.value.find((t) => t.id === activeThreadId.value) ?? null
  );

  const requiresAuth = computed(() => {
    const auth = useAuthStore();
    return !auth.isAuthenticated && guestMessageCount.value >= GUEST_LIMIT;
  });

  const guestMessagesRemaining = computed(() => {
    const auth = useAuthStore();
    if (auth.isAuthenticated) return null;
    return Math.max(0, GUEST_LIMIT - guestMessageCount.value);
  });

  async function loadThreads() {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) return;

    isLoadingThreads.value = true;
    error.value = "";
    try {
      threads.value = await chatService.getThreads();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to load threads";
    } finally {
      isLoadingThreads.value = false;
    }
  }

  async function selectThread(id: string) {
    activeThreadId.value = id;
    isLoadingMessages.value = true;
    error.value = "";
    try {
      messages.value = await chatService.getMessages(id);
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : "Failed to load messages";
    } finally {
      isLoadingMessages.value = false;
    }
  }

  function startNewThread() {
    activeThreadId.value = null;
    messages.value = [];
    streamingContent.value = "";
    error.value = "";
  }

  async function sendMessage(content: string) {
    const auth = useAuthStore();
    error.value = "";

    if (!auth.isAuthenticated) {
      if (guestMessageCount.value >= GUEST_LIMIT) {
        error.value = "You've used all free messages. Please sign in to continue.";
        return;
      }
      guestMessageCount.value++;
      localStorage.setItem(GUEST_COUNT_KEY, String(guestMessageCount.value));
    }

    // Optimistic: add user message immediately
    const optimisticMsg: ChatMessage = {
      id: crypto.randomUUID(),
      thread_id: activeThreadId.value ?? "",
      role: "user",
      content,
      provider: null,
      model: null,
      created_at: new Date().toISOString(),
    };
    messages.value.push(optimisticMsg);

    isStreaming.value = true;
    streamingContent.value = "";

    try {
      const stream = chatService.sendMessage(
        content,
        activeThreadId.value ?? undefined
      );

      for await (const event of stream) {
        if (event.type === "content") {
          streamingContent.value += event.content;
        } else if (event.type === "done") {
          // Push completed assistant message
          messages.value.push({
            id: crypto.randomUUID(),
            thread_id: event.threadId ?? "",
            role: "assistant",
            content: streamingContent.value,
            provider: null,
            model: null,
            created_at: new Date().toISOString(),
          });
          streamingContent.value = "";

          if (event.threadId) {
            // Authenticated flow: update thread state
            if (!activeThreadId.value) {
              activeThreadId.value = event.threadId;
            }
            await loadThreads();
          }
        }
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Failed to send message";
    } finally {
      isStreaming.value = false;
    }
  }

  async function deleteThread(id: string) {
    error.value = "";
    try {
      await chatService.deleteThread(id);
      threads.value = threads.value.filter((t) => t.id !== id);
      if (activeThreadId.value === id) {
        startNewThread();
      }
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : "Failed to delete thread";
    }
  }

  return {
    threads,
    activeThreadId,
    messages,
    streamingContent,
    isStreaming,
    isLoadingThreads,
    isLoadingMessages,
    error,
    activeThread,
    requiresAuth,
    guestMessagesRemaining,
    guestMessageCount,
    loadThreads,
    selectThread,
    startNewThread,
    sendMessage,
    deleteThread,
  };
});
