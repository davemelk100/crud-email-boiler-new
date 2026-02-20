import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  chatService,
  type ChatThread,
  type ChatMessage,
} from "@/services/chat/chatService";

export const useChatStore = defineStore("chat", () => {
  const threads = ref<ChatThread[]>([]);
  const activeThreadId = ref<string | null>(null);
  const messages = ref<ChatMessage[]>([]);
  const streamingContent = ref("");
  const isStreaming = ref(false);
  const isLoadingThreads = ref(false);
  const isLoadingMessages = ref(false);
  const error = ref("");

  const activeThread = computed(() =>
    threads.value.find((t) => t.id === activeThreadId.value) ?? null
  );

  async function loadThreads() {
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
    error.value = "";

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
            thread_id: event.threadId,
            role: "assistant",
            content: streamingContent.value,
            provider: null,
            model: null,
            created_at: new Date().toISOString(),
          });
          streamingContent.value = "";

          // If new thread, update state and reload threads
          if (!activeThreadId.value) {
            activeThreadId.value = event.threadId;
          }
          await loadThreads();
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
    loadThreads,
    selectThread,
    startNewThread,
    sendMessage,
    deleteThread,
  };
});
