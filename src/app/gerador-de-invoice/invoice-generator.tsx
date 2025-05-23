"use client";
import { ContactCard } from "@/app/gerador-de-invoice/components/contact-card";
import { TrashButton } from "@/components/trash-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { PAYMENT_METHOD_TEMPLATES } from "./constants";
import { useInvoice } from "./hooks/use-invoice";
import { CURRENCIES, CurrencyCode } from "./types";

const DashedInput = ({
  className,
  label,
  ...props
}: React.ComponentProps<"input"> & { label: string }) => (
  <Input
    className={cn(
      "border-dashed border-2 focus:border-none bg-transparent focus-visible:ring-primary/50",
      className
    )}
    {...props}
    aria-label={label}
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
      label="Valor do item"
      className={cn("pl-7 text-right", className)}
      {...props}
    />
  </div>
);

const InvoiceHistorySkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">Histórico de Invoices</h2>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
        loading
      >
        <Trash2 className="h-4 w-4" />
      </Button>
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

export default function InvoiceGenerator() {
  const invoiceRef = useRef<HTMLFormElement>(null);
  const [historyHeight, setHistoryHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () => {
      if (invoiceRef.current) {
        const invoiceHeight = invoiceRef.current.getBoundingClientRect().height;
        setHistoryHeight(`${invoiceHeight}px`);
      }
    };

    // Initial height set
    updateHeight();

    // Update height on window resize
    window.addEventListener("resize", updateHeight);

    // Set up resize observer to update height when invoice form changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (invoiceRef.current) {
      resizeObserver.observe(invoiceRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateHeight);
      resizeObserver.disconnect();
    };
  }, []);

  const {
    formData,
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
    setFormData,
  } = useInvoice();

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="grid lg:gap-8 gap-4 lg:grid-cols-12">
      <div
        style={{ height: isLargeScreen ? historyHeight : "auto" }}
        className="nice-scrollbar lg:px-4 lg:-mx-4 lg:col-span-3 overflow-auto"
      >
        <Suspense fallback={<InvoiceHistorySkeleton />}>
          <InvoiceHistory onSelect={setFormData} setCurrency={setCurrency} />
        </Suspense>
      </div>

      {/* Invoice Form */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "lg:col-span-9 space-y-4 lg:space-y-8 bg-slate-900 rounded-xl border border-slate-800 p-4 max-w-full transition-all duration-300 motion-preset-blur-right-sm"
        )}
        key={formData.id}
        ref={invoiceRef}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start min-w-full">
          <div className="space-y-2 hidden md:block">
            <DashedInput
              placeholder="URL da logo da empresa (opcional)"
              value={formData.companyLogo}
              onChange={(e) => handleCompanyLogoChange(e.target.value)}
              className="w-[300px]"
              label="URL do logotipo da empresa"
            />
          </div>
          <div className="space-y-2 flex-1 md:flex-none">
            <div className="grid grid-cols-2 items-center gap-2">
              <span className="text-slate-400 md:text-right">Invoice #:</span>
              <DashedInput
                value={formData.invoiceNumber}
                onChange={(e) => handleInvoiceNumberChange(e.target.value)}
                placeholder={`INV-${new Date().getFullYear()}-1`}
                className="lg:w-32 text-left h-8"
                label="Número da invoice"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <span className="text-slate-400 md:text-right">Created:</span>
              <DashedInput
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleInvoiceDateChange(e.target.value)}
                className="lg:w-32 text-left h-8"
                label="Data de emissão da invoice"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <span className="text-slate-400 md:text-right">Due:</span>
              <DashedInput
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                className="lg:w-32 text-left h-8"
                label="Data de vencimento da invoice"
              />
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="flex justify-between flex-col lg:flex-row gap-4 lg:gap-8">
          <ContactCard
            type="vendor"
            info={formData.vendorInfo}
            onSelect={(info) => handleContactSelect("vendorInfo", info)}
          />
          <ContactCard
            type="customer"
            info={formData.customerInfo}
            onSelect={(info) => handleContactSelect("customerInfo", info)}
          />
        </div>

        {/* Payment Methods Section */}
        <div className="space-y-4 grid">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full">
                Adicionar método de pagamento (opcional)
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800">
              {Object.entries(PAYMENT_METHOD_TEMPLATES).map(([key, value]) => (
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
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {formData.paymentMethods.map((paymentMethod, paymentIndex) => (
            <div
              key={paymentIndex}
              className="grid gap-2 motion-preset-slide-down"
            >
              <div className="grid grid-cols-12 gap-4 bg-slate-800 p-2 rounded-t-lg font-semibold">
                <div className="col-span-4 lg:col-span-6 flex items-center">
                  Payment Method
                </div>
                <div className="col-span-8 lg:col-span-6 flex items-center gap-1">
                  <DashedInput
                    value={paymentMethod.rail}
                    onChange={(e) =>
                      handlePaymentMethodRailChange(
                        paymentIndex,
                        e.target.value
                      )
                    }
                    placeholder="Método de pagamento"
                    className="lg:min-w-64 text-right max-w-full"
                    label="Nome do método de pagamento"
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
                      label="Nome do detalhe do método de pagamento"
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
                      label="Valor do detalhe do método de pagamento"
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
        <div className="space-y-2">
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
                <div className="col-span-6 lg:col-span-8">
                  <DashedInput
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    placeholder="Software Development"
                    label="Descrição do item"
                  />
                </div>
                <div className="col-span-6 lg:col-span-4 flex items-center gap-1">
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
        <div className="flex justify-between items-center border-t pt-2 lg:pt-4 border-slate-800 gap-2">
          <Select
            value={currency}
            onValueChange={(value: CurrencyCode) => setCurrency(value)}
          >
            <SelectTrigger
              className="w-48 lg:w-64 "
              data-testid="currency-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="">
              {Object.entries(CURRENCIES).map(([code, { name }]) => (
                <SelectItem key={code} value={code}>
                  {code} - {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-xl font-semibold flex gap-4 items-center">
            <span className="text-slate-400">Total:</span>
            <span data-testid="total">
              {formatCurrency(total, currency, "en-US")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={resetForm}>
            Limpar
          </Button>
          <Button type="submit" loading={isLoading}>
            Gerar Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
