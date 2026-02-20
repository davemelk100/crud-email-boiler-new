import { chatService } from "@/services/chat/chatService";
import { supabase } from "@/services/auth/supabaseClient";
import { vi } from "vitest";
import chatResponses from "../fixtures/chat-responses.json";

describe("chatService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getThreads calls supabase from('chat_threads') and returns data", async () => {
    const mockThreads = [{ id: "t1", title: "Thread 1" }];
    const orderFn = vi.fn().mockResolvedValue({ data: mockThreads, error: null });
    const selectFn = vi.fn().mockReturnValue({ order: orderFn });
    vi.mocked(supabase.from).mockReturnValue({ select: selectFn } as any);

    const result = await chatService.getThreads();

    expect(supabase.from).toHaveBeenCalledWith("chat_threads");
    expect(result).toEqual(mockThreads);
  });

  it("getMessages filters by threadId", async () => {
    const mockMessages = [{ id: "m1", content: "Hello" }];
    const orderFn = vi.fn().mockResolvedValue({ data: mockMessages, error: null });
    const eqFn = vi.fn().mockReturnValue({ order: orderFn });
    const selectFn = vi.fn().mockReturnValue({ eq: eqFn });
    vi.mocked(supabase.from).mockReturnValue({ select: selectFn } as any);

    const result = await chatService.getMessages("t1");

    expect(supabase.from).toHaveBeenCalledWith("chat_messages");
    expect(eqFn).toHaveBeenCalledWith("thread_id", "t1");
    expect(result).toEqual(mockMessages);
  });

  it("deleteThread calls delete with correct id", async () => {
    const eqFn = vi.fn().mockResolvedValue({ error: null });
    const deleteFn = vi.fn().mockReturnValue({ eq: eqFn });
    vi.mocked(supabase.from).mockReturnValue({ delete: deleteFn } as any);

    await chatService.deleteThread("t1");

    expect(supabase.from).toHaveBeenCalledWith("chat_threads");
    expect(eqFn).toHaveBeenCalledWith("id", "t1");
  });

  it("chat-responses.json contains demo responses", () => {
    expect(chatResponses.responses).toHaveLength(3);
    expect(chatResponses.responses[0].message).toBe("Hello");
    expect(chatResponses.responses[2].message).toBe("default");
  });

  it("sendMessage sends POST and parses SSE stream", async () => {
    const sseData = 'data: {"content":"Hi"}\ndata: {"done":true,"threadId":"t1"}\n';
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(sseData));
        controller.close();
      },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        body: stream,
      })
    );

    const events: any[] = [];
    for await (const event of chatService.sendMessage("Hello")) {
      events.push(event);
    }

    expect(events).toEqual([
      { type: "content", content: "Hi" },
      { type: "done", threadId: "t1" },
    ]);

    vi.unstubAllGlobals();
  });
});
