import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ContactForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText("Priya Ramirez")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Rosewood Hair Studio")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("priya@rosewoodhair.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Answer questions about services/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Message" })
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Business name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not submit when email field has invalid format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Priya Ramirez"), "Test");
    await user.type(
      screen.getByPlaceholderText("Rosewood Hair Studio"),
      "Biz"
    );
    // type="email" field — browser validation prevents submit for truly invalid emails
    await user.type(
      screen.getByPlaceholderText("priya@rosewoodhair.com"),
      "not-valid"
    );
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    // fetch should NOT be called since HTML5 email validation blocks submit
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("submits valid data and shows success message", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Priya Ramirez"), "Priya");
    await user.type(
      screen.getByPlaceholderText("Rosewood Hair Studio"),
      "Rosewood"
    );
    await user.type(
      screen.getByPlaceholderText("priya@rosewoodhair.com"),
      "priya@test.com"
    );
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText(/Thanks!/)).toBeInTheDocument();
    });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("shows error message when API fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Priya Ramirez"), "Test");
    await user.type(
      screen.getByPlaceholderText("Rosewood Hair Studio"),
      "Biz"
    );
    await user.type(
      screen.getByPlaceholderText("priya@rosewoodhair.com"),
      "a@b.com"
    );
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });
});
