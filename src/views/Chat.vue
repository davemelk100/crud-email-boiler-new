<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { useChatStore } from "@/stores/chatStore";

const chat = useChatStore();
const input = ref("");
const messagesEl = ref<HTMLElement | null>(null);
const sidebarOpen = ref(false);

onMounted(() => {
  chat.loadThreads();
});

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    }
  });
}

watch(() => chat.messages.length, scrollToBottom);
watch(() => chat.streamingContent, scrollToBottom);

async function handleSend() {
  const text = input.value.trim();
  if (!text || chat.isStreaming) return;
  input.value = "";
  await chat.sendMessage(text);
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

function handleSelectThread(id: string) {
  chat.selectThread(id);
  sidebarOpen.value = false;
}

function handleNewThread() {
  chat.startNewThread();
  sidebarOpen.value = false;
}
</script>

<template>
  <div class="chat-layout">
    <!-- Mobile sidebar toggle -->
    <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
      {{ sidebarOpen ? "\u2715" : "\u2630" }}
    </button>

    <!-- Thread sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <button class="new-chat-btn" @click="handleNewThread">+ New Chat</button>
      <div class="thread-list">
        <div
          v-for="thread in chat.threads"
          :key="thread.id"
          class="thread-item"
          :class="{ active: thread.id === chat.activeThreadId }"
          @click="handleSelectThread(thread.id)"
        >
          <span class="thread-title">{{ thread.title || "Untitled" }}</span>
          <button
            class="delete-btn"
            @click.stop="chat.deleteThread(thread.id)"
            title="Delete thread"
          >
            &times;
          </button>
        </div>
      </div>
    </aside>

    <!-- Main chat area -->
    <main class="chat-main">
      <p v-if="chat.error" class="error">{{ chat.error }}</p>

      <div ref="messagesEl" class="messages">
        <div
          v-if="chat.messages.length === 0 && !chat.isStreaming"
          class="empty-state"
        >
          <p>Start a conversation by typing a message below.</p>
        </div>

        <div
          v-for="msg in chat.messages"
          :key="msg.id"
          class="message"
          :class="msg.role"
        >
          <div class="bubble">{{ msg.content }}</div>
        </div>

        <!-- Streaming bubble -->
        <div v-if="chat.isStreaming && chat.streamingContent" class="message assistant">
          <div class="bubble">
            {{ chat.streamingContent }}<span class="cursor">|</span>
          </div>
        </div>

        <div v-if="chat.isStreaming && !chat.streamingContent" class="message assistant">
          <div class="bubble">
            <span class="cursor">|</span>
          </div>
        </div>
      </div>

      <div class="input-area">
        <textarea
          v-model="input"
          placeholder="Type a message..."
          rows="2"
          :disabled="chat.isStreaming"
          @keydown="handleKeydown"
        ></textarea>
        <button
          class="send-btn"
          :disabled="chat.isStreaming || !input.trim()"
          @click="handleSend"
        >
          Send
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.chat-layout {
  display: flex;
  height: calc(100vh - 53px);
  background: #fafafa;
  position: relative;
}

.sidebar-toggle {
  display: none;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 20;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  color: #1a1a1a;
}

.sidebar {
  width: 240px;
  border-right: 1px solid #ccc;
  background: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.new-chat-btn {
  margin: 0.75rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font: inherit;
  color: #1a1a1a;
}
.new-chat-btn:hover {
  background: #f0f0f0;
}

.thread-list {
  flex: 1;
  overflow-y: auto;
}

.thread-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}
.thread-item:hover {
  background: #f5f5f5;
}
.thread-item.active {
  background: #eee;
}

.thread-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  color: #1a1a1a;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0 0.25rem;
  line-height: 1;
}
.delete-btn:hover {
  color: #d32f2f;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.error {
  color: #d32f2f;
  padding: 0.5rem 1rem;
  margin: 0;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.message {
  display: flex;
}
.message.user {
  justify-content: flex-end;
}
.message.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
.message.user .bubble {
  background: #1a1a1a;
  color: #fff;
}
.message.assistant .bubble {
  background: #e8e8e8;
  color: #1a1a1a;
}

.cursor {
  animation: blink 0.8s step-end infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.input-area {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #ccc;
  background: #fff;
}
.input-area textarea {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
  resize: none;
}
.send-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #1a1a1a;
  color: #fff;
  cursor: pointer;
  font: inherit;
  align-self: flex-end;
}
.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .chat-layout {
    height: calc(100vh - 53px);
  }

  .sidebar-toggle {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 53px;
    z-index: 15;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
  .sidebar.open {
    transform: translateX(0);
  }

  .input-area {
    padding-bottom: calc(0.75rem + 53px);
  }

  .bubble {
    max-width: 85%;
  }
}
</style>
