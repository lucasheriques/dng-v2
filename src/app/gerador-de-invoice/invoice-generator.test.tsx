import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import InvoiceGenerator from "./invoice-generator";

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob()),
  })
) as unknown as typeof fetch;

// Mock fetch
const mockFetch = global.fetch as Mock;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn();

// Mock window.open
global.window.open = vi.fn();

describe("InvoiceGenerator", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should call the endpoint with correct payload when generating invoice", async () => {
    const user = userEvent.setup();
    render(<InvoiceGenerator />);

    // Fill form data
    await user.type(
      screen.getByPlaceholderText(`INV-${new Date().getFullYear()}-1`),
      "INV001"
    );

    // Add an item
    const descriptionInputs = screen.getAllByPlaceholderText(
      "Software Development"
    );
    const priceInputs = screen.getAllByPlaceholderText("0.00");
    await user.type(descriptionInputs[0], "Test Service");
    await user.type(priceInputs[0], "100");

    // Fill vendor info
    const vendorButton = screen.getByText("Adicionar empresa");
    await user.click(vendorButton);
    await user.type(screen.getByPlaceholderText("Name"), "Test Company");
    await user.type(screen.getByPlaceholderText("Email"), "company@test.com");
    await user.type(
      screen.getByPlaceholderText("Address line 1"),
      "123 Test St"
    );
    await user.type(
      screen.getByPlaceholderText("Address line 2"),
      "City, State 12345"
    );
    await user.click(screen.getByText("Salvar"));

    // Generate invoice
    await user.click(screen.getByText("Gerar Invoice"));

    // Verify fetch was called with correct URL
    expect(mockFetch).toHaveBeenCalledWith(
      "https://tools.lucasfaria.dev/v1/invoices",
      expect.objectContaining({
        method: "POST",
        body: expect.any(String),
      })
    );

    // Parse the payload and verify its contents
    const payload = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(payload).toMatchObject({
      invoiceNumber: "INV001",
      vendorInfo: {
        name: "Test Company",
        email: "company@test.com",
        streetAddress: "123 Test St",
        cityStateZip: "City, State 12345",
      },
      items: [
        {
          description: "Test Service",
          price: "$100.00",
        },
      ],
      total: "$100.00",
    });
  });

  it("should add and remove line items correctly", async () => {
    const user = userEvent.setup();
    render(<InvoiceGenerator />);

    // Add first item
    await user.click(screen.getByText("Adicionar item"));
    const descriptionInputs = screen.getAllByPlaceholderText(
      "Software Development"
    );
    const priceInputs = screen.getAllByPlaceholderText("0.00");

    // Fill first item
    await user.type(descriptionInputs[0], "Service 1");
    await user.type(priceInputs[0], "100");

    // Add second item
    await user.click(screen.getByText("Adicionar item"));
    await user.type(descriptionInputs[1], "Service 2");
    await user.type(priceInputs[1], "50");

    // Check total
    const totalText = screen.getByText("Total:");
    expect(totalText.nextElementSibling).toHaveTextContent("$150.00");

    // Remove first item
    const removeButtons = screen.getAllByLabelText("Deletar item");
    await user.click(removeButtons[0]);

    // Check updated total
    expect(totalText.nextElementSibling).toHaveTextContent("$50.00");
  });

  it("should add and remove payment methods correctly", async () => {
    const user = userEvent.setup();
    render(<InvoiceGenerator />);

    // Open payment method dropdown
    await user.click(
      screen.getByText("Adicionar método de pagamento (opcional)")
    );

    // Add ACH payment method
    await user.click(screen.getByText("ACH"));

    // Check if ACH fields are added
    expect(screen.getByDisplayValue("ACH")).toBeInTheDocument();

    // Add more details
    await user.click(screen.getByText("Adicionar mais informações"));

    // Add details
    const detailInputs = screen.getAllByPlaceholderText("Detalhe do pagamento");
    const [, , , , , , detailNameInput, detailValueInput] = detailInputs; // skip the first 6 inputs as they're already added

    await user.type(detailNameInput, "Chave");
    await user.type(detailValueInput, "test@email.com");

    expect(detailNameInput).toHaveValue("Chave");
    expect(detailValueInput).toHaveValue("test@email.com");
    expect(screen.getByDisplayValue("Chave")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@email.com")).toBeInTheDocument();

    // Remove payment method details
    const removeDetailButtons = screen.getAllByLabelText(
      "Deletar detalhe do pagamento"
    );
    await user.click(removeDetailButtons[4]);

    expect(screen.queryByText("Chave")).not.toBeInTheDocument();
    expect(screen.queryByText("test@email.com")).not.toBeInTheDocument();

    // Remove payment method
    const removeButtons = screen.getAllByLabelText(
      "Deletar método de pagamento"
    );
    await user.click(removeButtons[0]);

    // Verify payment method is removed
    expect(screen.queryByDisplayValue("ACH")).not.toBeInTheDocument();
  });

  it("should save to localStorage when generating invoice", async () => {
    const user = userEvent.setup();
    render(<InvoiceGenerator />);

    // Fill form data
    await user.type(
      screen.getByPlaceholderText(`INV-${new Date().getFullYear()}-1`),
      "INV001"
    );

    // Add an item
    await user.click(screen.getByText("Adicionar item"));
    const descriptionInputs = screen.getAllByPlaceholderText(
      "Software Development"
    );
    const priceInputs = screen.getAllByPlaceholderText("0.00");
    await user.type(descriptionInputs[0], "Test Service");
    await user.type(priceInputs[0], "100");

    // Generate invoice
    await user.click(screen.getByText("Gerar Invoice"));

    // Verify localStorage was called with the correct data
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const setItemMock = localStorageMock.setItem as Mock;
    const savedInvoices = JSON.parse(setItemMock.mock.calls[0][1]);
    const savedInvoice = savedInvoices[0];

    // Filter out empty items from the saved invoice for comparison
    const filteredItems = savedInvoice.items.filter(
      (item: { description: string; price: string }) =>
        item.description !== "" && item.price !== ""
    );

    expect({
      invoiceNumber: savedInvoice.invoiceNumber,
      items: filteredItems,
      total: savedInvoice.total,
    }).toMatchObject({
      invoiceNumber: "INV001",
      items: [{ description: "Test Service", price: "100" }],
      total: "$100.00",
    });
  });

  it("should handle currency changes correctly", async () => {
    const user = userEvent.setup();
    render(<InvoiceGenerator />);

    // Add an item
    await user.click(screen.getByText("Adicionar item"));
    const descriptionInputs = screen.getAllByPlaceholderText(
      "Software Development"
    );
    const priceInputs = screen.getAllByPlaceholderText("0.00");
    await user.type(descriptionInputs[0], "Test Service");
    await user.type(priceInputs[0], "100");

    // Initial total in USD
    const totalText = await screen.findByTestId("total");
    expect(totalText).toHaveTextContent("$100.00");
  });

  it("should clear form data correctly", async () => {
    const user = userEvent.setup();
    render(<InvoiceGenerator />);

    // Fill some data
    await user.type(
      screen.getByPlaceholderText(`INV-${new Date().getFullYear()}-1`),
      "INV001"
    );
    await user.click(screen.getByText("Adicionar item"));
    const descriptionInputs = screen.getAllByPlaceholderText(
      "Software Development"
    );
    const priceInputs = screen.getAllByPlaceholderText("0.00");
    await user.type(descriptionInputs[0], "Test Service");
    await user.type(priceInputs[0], "100");

    // Clear form
    await user.click(screen.getByText("Limpar"));

    // Verify form is cleared
    expect(
      screen.getByPlaceholderText(`INV-${new Date().getFullYear()}-1`)
    ).toHaveValue("");
    expect(screen.queryByDisplayValue("Test Service")).not.toBeInTheDocument();
    const totalText = await screen.findByTestId("total");
    expect(totalText).toHaveTextContent("$0.00");
  });
});
