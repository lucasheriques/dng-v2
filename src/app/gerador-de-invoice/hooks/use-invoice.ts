import { addMonths, format } from "date-fns";
import { nanoid } from "nanoid";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { PAYMENT_METHOD_TEMPLATES } from "../constants";
import {
  ContactInfo,
  CURRENCIES,
  CurrencyCode,
  Invoice,
  StoredInvoice,
} from "../types";

const EMPTY_INVOICE = {
  companyLogo: "",
  invoiceNumber: "",
  invoiceDate: format(new Date(), "yyyy-MM-dd"),
  dueDate: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
  vendorInfo: {
    name: "",
    streetAddress: "",
    cityStateZip: "",
    email: "",
  },
  customerInfo: {
    name: "",
    streetAddress: "",
    cityStateZip: "",
    email: "",
  },
  paymentMethods: [],
  items: [{ description: "", price: "0" }],
  total: "0",
};

export function useInvoice() {
  const [formData, setFormData] = useState<Invoice>(EMPTY_INVOICE);
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [, setInvoiceHistory] = useLocalStorage<StoredInvoice[]>(
    "invoiceHistory",
    []
  );

  const handleContactSelect = (
    type: "vendorInfo" | "customerInfo",
    info: ContactInfo
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: info,
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (
    index: number,
    field: "description" | "price",
    value: string
  ) => {
    setFormData((prev) => {
      const newItems = prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );

      // Calculate new total
      const newTotal = newItems
        .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
        .toFixed(2);

      return {
        ...prev,
        items: newItems,
        total: newTotal,
      };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", price: "0" }],
    }));
  };

  const addPaymentMethod = (
    template: keyof typeof PAYMENT_METHOD_TEMPLATES
  ) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: [
        ...prev.paymentMethods,
        PAYMENT_METHOD_TEMPLATES[template],
      ],
    }));
  };

  const handlePaymentMethodRailChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((method, i) =>
        i === index ? { ...method, rail: value } : method
      ),
    }));
  };

  const handlePaymentMethodChange = (
    paymentIndex: number,
    detailIndex: number,
    field: "name" | "value",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((method, i) => {
        if (i !== paymentIndex) return method;

        const newDetails = method.details.map((detail, j) =>
          j === detailIndex ? { ...detail, [field]: value } : detail
        );

        return { ...method, details: newDetails };
      }),
    }));
  };

  const addPaymentMethodDetails = (paymentIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((method, i) => {
        if (i !== paymentIndex) return method;

        const newDetails = [...method.details, { name: "", value: "" }];

        return { ...method, details: newDetails };
      }),
    }));
  };

  const handleRemovePaymentMethod = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((_, i) => i !== index),
    }));
  };

  const handleRemovePaymentMethodDetail = (
    paymentIndex: number,
    detailIndex: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((method, i) =>
        i === paymentIndex
          ? {
              ...method,
              details: method.details.filter((_, j) => j !== detailIndex),
            }
          : method
      ),
    }));
  };

  const handleCompanyLogoChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      companyLogo: value,
    }));
  };

  const handleInvoiceNumberChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: value,
    }));
  };

  const handleInvoiceDateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      invoiceDate: value,
    }));
  };

  const handleDueDateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: value,
    }));
  };

  const posthog = usePostHog();

  const total = formData.items
    .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    .toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { companyLogo, invoiceDate, dueDate, ...rest } = formData;

      // Format all price values with currency symbol
      const formattedItems = rest.items.map((item) => ({
        description: item.description || "Software Development",
        price: `${CURRENCIES[currency].symbol}${parseFloat(item.price).toFixed(2)}`,
      }));

      const formattedTotal = `${CURRENCIES[currency].symbol}${parseFloat(total).toFixed(2)}`;

      // Save to history with formatted values and currency
      const historyEntry: StoredInvoice = {
        ...formData,
        id: nanoid(),
        items: rest.items,
        total: formattedTotal,
        currency,
      };
      setInvoiceHistory((prev) => [historyEntry, ...prev]);

      posthog.capture("invoice_generated", {
        invoice: {
          ...historyEntry,
          total: parseFloat(total),
        },
      });

      const payload = {
        companyLogo:
          companyLogo !== ""
            ? companyLogo
            : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${rest.vendorInfo.name}&rounded=true&size=16`,
        invoiceDate: format(new Date(invoiceDate), "MMM d, yyyy"),
        dueDate: format(new Date(dueDate), "MMM d, yyyy"),
        items: formattedItems,
        total: formattedTotal,
        invoiceNumber: rest.invoiceNumber,
        vendorInfo: rest.vendorInfo,
        customerInfo: rest.customerInfo,
        paymentMethods: rest.paymentMethods,
      };

      const request = await fetch("https://tools.lucasfaria.dev/v1/invoices", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const pdf = await request.blob();
      const url = URL.createObjectURL(pdf);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to generate invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_INVOICE);
  };

  return {
    formData,
    setFormData,
    isLoading,
    currency,
    setCurrency,
    total,
    handleContactSelect,
    handleRemoveItem,
    handleItemChange,
    addItem,
    addPaymentMethod,
    handlePaymentMethodRailChange,
    handlePaymentMethodChange,
    addPaymentMethodDetails,
    handleRemovePaymentMethod,
    handleRemovePaymentMethodDetail,
    handleCompanyLogoChange,
    handleInvoiceNumberChange,
    handleInvoiceDateChange,
    handleDueDateChange,
    handleSubmit,
    resetForm,
  };
}
