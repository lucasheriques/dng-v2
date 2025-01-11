"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { addMonths, format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { PAYMENT_METHOD_TEMPLATES } from "./constants";
import {
  ContactInfo,
  CURRENCIES,
  CurrencyCode,
  Invoice,
  StoredInvoice,
} from "./types";

const TrashButton = ({
  onClick,
  ariaLabel,
}: {
  onClick: () => void;
  ariaLabel: string;
}) => (
  <Button
    variant="ghost"
    type="button"
    size="icon"
    className="shrink-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);

const DashedInput = ({
  className,
  ...props
}: React.ComponentProps<"input">) => (
  <Input
    className={cn(
      "border-dashed border-2 focus:border-none bg-transparent focus-visible:ring-primary/50",
      className
    )}
    {...props}
  />
);

interface PriceInputProps extends React.ComponentProps<"input"> {
  currency: CurrencyCode;
}

const PriceInput = ({ currency, className, ...props }: PriceInputProps) => (
  <div className="relative flex-1">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      {CURRENCIES[currency].symbol}
    </span>
    <DashedInput
      type="number"
      step="0.01"
      min="0"
      className={cn("pl-7 text-right", className)}
      {...props}
    />
  </div>
);

interface ContactCardProps {
  type: "vendor" | "customer";
  info: ContactInfo;
  onSelect: (info: ContactInfo) => void;
}

function ContactCard({ type, info, onSelect }: ContactCardProps) {
  const [savedContacts, setSavedContacts] = useLocalStorage<ContactInfo[]>(
    `${type}Contacts`,
    []
  );
  const [editingInfo, setEditingInfo] = useState<ContactInfo>(info);

  const existingContactIndex = savedContacts.findIndex(
    (contact) => contact.email === editingInfo.email
  );

  const handleSave = () => {
    onSelect(editingInfo);

    // Update existing contact or add new one
    if (existingContactIndex >= 0) {
      const newContacts = [...savedContacts];
      newContacts[existingContactIndex] = editingInfo;
      setSavedContacts(newContacts);
    } else {
      setSavedContacts([...savedContacts, editingInfo]);
    }
  };

  const handleDelete = (email: string) => {
    const newContacts = savedContacts.filter(
      (contact) => contact.email !== email
    );
    setSavedContacts(newContacts);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full text-left space-y-1 p-4 rounded-lg border border-dashed border-slate-700 hover:border-primary transition-colors focus:border-primary focus:outline-none"
        >
          <p className="text-lg font-semibold">
            {info.name || `Add ${type} info`}
          </p>
          {info.name && (
            <>
              <p className="text-sm text-slate-400">{info.streetAddress}</p>
              <p className="text-sm text-slate-400">{info.cityStateZip}</p>
              <p className="text-sm text-slate-400">{info.email}</p>
            </>
          )}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "vendor" ? "Company" : "Client"} Information
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Saved Contacts */}
          {savedContacts.length > 0 && (
            <div className="space-y-2">
              <Label>
                {type === "vendor" ? "Empresas salvas" : "Clientes salvos"}
              </Label>
              <div className="grid gap-2">
                {savedContacts.map((contact, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <DialogClose
                      type="button"
                      onClick={() => {
                        setEditingInfo(contact);
                        onSelect(contact);
                      }}
                      className="flex-1 text-left p-3 rounded-lg border border-slate-800 hover:bg-slate-800/50 transition-colors"
                    >
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-slate-400">{contact.email}</p>
                    </DialogClose>
                    <TrashButton
                      onClick={() => handleDelete(contact.email)}
                      ariaLabel="Delete contact"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Form */}
          <div className="space-y-4">
            <Label>
              {existingContactIndex >= 0
                ? type === "vendor"
                  ? "Editar informações da empresa"
                  : "Editar informações do cliente"
                : type === "vendor"
                  ? "Adicionar nova empresa"
                  : "Adicionar novo cliente"}
            </Label>
            <div className="space-y-2">
              <Input
                placeholder="Name"
                value={editingInfo.name}
                onChange={(e) =>
                  setEditingInfo((prev: ContactInfo) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Address line 1"
                value={editingInfo.streetAddress}
                onChange={(e) =>
                  setEditingInfo((prev: ContactInfo) => ({
                    ...prev,
                    streetAddress: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Address line 2"
                value={editingInfo.cityStateZip}
                onChange={(e) =>
                  setEditingInfo((prev: ContactInfo) => ({
                    ...prev,
                    cityStateZip: e.target.value,
                  }))
                }
              />
              <Input
                type="email"
                placeholder="Email"
                value={editingInfo.email}
                onChange={(e) =>
                  setEditingInfo((prev: ContactInfo) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <DialogClose onClick={handleSave} className="w-full" asChild>
              <Button>Salvar</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatCurrency(amount: string | number, currency: CurrencyCode) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

const InvoiceHistorySkeleton = () => (
  <div className="w-80 shrink-0 space-y-4 ">
    <div className="flex justify-between items-center">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
    <Skeleton className="h-10 w-full rounded-md" />
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

const InvoiceHistory = dynamic(() => import("./components/invoice-history"), {
  ssr: false,
  loading: InvoiceHistorySkeleton,
});

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

export default function InvoiceGenerator() {
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

  const total = formData.items
    .filter((item) => item.description !== "" && item.price !== "")
    .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    .toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { companyLogo, invoiceDate, dueDate, ...rest } = formData;

      // Format all price values with currency symbol
      const formattedItems = rest.items
        .filter((item) => item.description !== "" && item.price !== "")
        .map((item) => ({
          ...item,
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

  return (
    <div className="flex gap-8">
      <Suspense fallback={<InvoiceHistorySkeleton />}>
        <InvoiceHistory onSelect={setFormData} setCurrency={setCurrency} />
      </Suspense>

      {/* Invoice Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 space-y-8 bg-slate-900 rounded-xl border border-slate-800 p-8"
      >
        <div className="">
          {/* Rest of the form remains the same */}
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              {formData.companyLogo ? (
                <img
                  src={formData.companyLogo}
                  alt="Company Logo"
                  className="h-16 w-auto"
                />
              ) : (
                <DashedInput
                  placeholder="Your Logo URL (optional)"
                  value={formData.companyLogo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      companyLogo: e.target.value,
                    }))
                  }
                  className="w-[300px]"
                />
              )}
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-slate-400">Invoice #:</span>
                <DashedInput
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      invoiceNumber: e.target.value,
                    }))
                  }
                  placeholder="123"
                  className="w-32 text-left h-8"
                />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-slate-400">Created:</span>
                <DashedInput
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      invoiceDate: e.target.value,
                    }))
                  }
                  className="w-32 text-left h-8"
                />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-slate-400">Due:</span>
                <DashedInput
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="w-32 text-left h-8"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="flex justify-between pt-8 gap-8">
            <div className="flex-1">
              <ContactCard
                type="vendor"
                info={formData.vendorInfo}
                onSelect={(info) => handleContactSelect("vendorInfo", info)}
              />
            </div>
            <div className="flex-1">
              <ContactCard
                type="customer"
                info={formData.customerInfo}
                onSelect={(info) => handleContactSelect("customerInfo", info)}
              />
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="pt-8 space-y-4 grid">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full">
                  Adicionar método de pagamento (opcional)
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800">
                {Object.entries(PAYMENT_METHOD_TEMPLATES).map(
                  ([key, value]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() =>
                        addPaymentMethod(
                          key as keyof typeof PAYMENT_METHOD_TEMPLATES
                        )
                      }
                    >
                      {value.rail}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {formData.paymentMethods.map((paymentMethod, paymentIndex) => (
              <div
                key={paymentIndex}
                className="grid gap-2 motion-preset-slide-down"
              >
                <div className="grid grid-cols-12 gap-4 bg-slate-800 p-2 rounded-t-lg font-semibold">
                  <div className="col-span-6 flex items-center">
                    Payment Method
                  </div>
                  <div className="col-span-6 flex items-center gap-1">
                    <DashedInput
                      value={paymentMethod.rail}
                      onChange={(e) =>
                        handlePaymentMethodRailChange(
                          paymentIndex,
                          e.target.value
                        )
                      }
                      placeholder="Método de pagamento"
                      className="min-w-64 text-right"
                    />
                    <TrashButton
                      onClick={() => handleRemovePaymentMethod(paymentIndex)}
                      ariaLabel="Deletar método de pagamento"
                    />
                  </div>
                </div>
                {paymentMethod.details.map((detail, detailIndex) => (
                  <div
                    key={`${paymentIndex}-${detailIndex}`}
                    className="grid grid-cols-12 gap-4 motion-preset-slide-down"
                  >
                    <div className="col-span-6">
                      <DashedInput
                        value={detail.name}
                        onChange={(e) =>
                          handlePaymentMethodChange(
                            paymentIndex,
                            detailIndex,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Detalhe do pagamento"
                      />
                    </div>
                    <div className="col-span-6 flex items-center gap-1">
                      <DashedInput
                        value={detail.value}
                        onChange={(e) =>
                          handlePaymentMethodChange(
                            paymentIndex,
                            detailIndex,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Detalhe do pagamento"
                      />
                      <TrashButton
                        onClick={() =>
                          handleRemovePaymentMethodDetail(
                            paymentIndex,
                            detailIndex
                          )
                        }
                        ariaLabel="Deletar detalhe do pagamento"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addPaymentMethodDetails(paymentIndex)}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar mais informações
                </Button>
              </div>
            ))}
          </div>

          {/* Items Section */}
          <div className="pt-8 space-y-2">
            <div className="grid grid-cols-12 gap-4 bg-slate-800 p-2 rounded-t-lg font-semibold">
              <div className="col-span-8">Item</div>
              <div className="col-span-4 text-right">Price</div>
            </div>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 motion-preset-slide-down"
                >
                  <div className="col-span-8">
                    <DashedInput
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      placeholder="Informações do serviço"
                    />
                  </div>
                  <div className="col-span-4 flex items-center gap-1">
                    <PriceInput
                      currency={currency}
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                    <TrashButton
                      onClick={() => handleRemoveItem(index)}
                      ariaLabel="Deletar item"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full"
            >
              Adicionar item
            </Button>
          </div>

          {/* Total Section */}
          <div className="pt-8 flex justify-between items-center border-t border-slate-800">
            <Select
              value={currency}
              onValueChange={(value: CurrencyCode) => setCurrency(value)}
            >
              <SelectTrigger
                className="w-64 bg-slate-800"
                data-testid="currency-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800">
                {Object.entries(CURRENCIES).map(([code, { name }]) => (
                  <SelectItem key={code} value={code}>
                    {code} - {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xl font-semibold flex gap-4 items-center">
              <span className="text-slate-400">Total:</span>
              <span data-testid="total">{formatCurrency(total, currency)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(EMPTY_INVOICE)}
            >
              Limpar
            </Button>
            <Button type="submit" loading={isLoading}>
              Gerar Invoice
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
