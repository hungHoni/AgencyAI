import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";

// Mock Resend with a proper class constructor
vi.mock("resend", () => {
  return {
    Resend: class MockResend {
      emails = {
        send: vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null }),
      };
    },
  };
});

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 on valid submission", async () => {
    const res = await POST(
      makeRequest({
        name: "Priya Ramirez",
        business: "Rosewood Hair Studio",
        email: "priya@rosewoodhair.com",
        message: "I need a chatbot",
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(
      makeRequest({ name: "", business: "Biz", email: "a@b.com", message: "" })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.errors).toContain("Name is required");
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(
      makeRequest({
        name: "Test",
        business: "Biz",
        email: "not-an-email",
        message: "",
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.errors).toContain("Invalid email format");
  });

  it("returns 400 when multiple fields are missing", async () => {
    const res = await POST(
      makeRequest({ name: "", business: "", email: "", message: "" })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("returns 200 when message is empty (optional field)", async () => {
    const res = await POST(
      makeRequest({
        name: "Test",
        business: "Biz",
        email: "a@b.com",
        message: "",
      })
    );
    expect(res.status).toBe(200);
  });
});
