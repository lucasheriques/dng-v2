"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CurrencyCode, Invoice, StoredInvoice } from "../types";

interface InvoiceHistoryCardProps {
  invoice: StoredInvoice;
  onClick: (invoice: Invoice) => void;
  setCurrency: (currency: CurrencyCode) => void;
}

function InvoiceHistoryCard({
  invoice,
  onClick,
  setCurrency,
}: InvoiceHistoryCardProps) {
  const formattedDate = invoice.invoiceDate
    ? format(new Date(invoice.invoiceDate), "MMM d, yyyy")
    : "No date";

  return (
    <button
      onClick={() => {
        // Convert stored invoice back to form data format
        const formInvoice: Invoice = {
          ...invoice,
        };
        onClick(formInvoice);
        setCurrency(invoice.currency);
      }}
      className="w-full text-left p-4 rounded-lg border border-slate-800 hover:bg-slate-800/50 transition-colors space-y-2 motion-preset-slide-right "
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">Invoice #{invoice.invoiceNumber}</p>
          <p className="text-sm text-slate-400">{formattedDate}</p>
        </div>
        <p className="text-primary font-medium">{invoice.total}</p>
      </div>
      <div className="text-sm text-slate-400">
        <p>From: {invoice.vendorInfo.name}</p>
        <p>To: {invoice.customerInfo.name}</p>
      </div>
    </button>
  );
}

interface InvoiceHistoryProps {
  onSelect: (invoice: Invoice) => void;
  setCurrency: (currency: CurrencyCode) => void;
}

export default function InvoiceHistory({
  onSelect,
  setCurrency,
}: InvoiceHistoryProps) {
  const [invoiceHistory, setInvoiceHistory] = useLocalStorage<StoredInvoice[]>(
    "invoiceHistory",
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = useMemo(() => {
    if (!searchTerm) return invoiceHistory;

    const search = searchTerm.toLowerCase();
    return invoiceHistory.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(search) ||
        invoice.vendorInfo.name.toLowerCase().includes(search) ||
        invoice.customerInfo.name.toLowerCase().includes(search) ||
        invoice.items.some((item) =>
          item.description.toLowerCase().includes(search)
        ) ||
        invoice.total.includes(search)
    );
  }, [invoiceHistory, searchTerm]);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all invoice history?")) {
      setInvoiceHistory([]);
    }
  };

  return (
    <div className="w-80 shrink-0 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Histórico de Invoices</h2>
        {invoiceHistory.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {invoiceHistory.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Pesquisar por valor, invoice, cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {invoiceHistory.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma invoice gerada ainda</p>
        ) : filteredHistory.length === 0 ? (
          <p className="text-sm text-slate-400">
            Nenhuma invoice encontrada com esses termos
          </p>
        ) : (
          <>
            {filteredHistory.slice(0, 5).map((invoice) => (
              <InvoiceHistoryCard
                key={invoice.id}
                invoice={invoice}
                onClick={onSelect}
                setCurrency={setCurrency}
              />
            ))}
            {filteredHistory.length > 5 && (
              <p className="text-sm text-center text-slate-400">
                +{filteredHistory.length - 5} invoices mais antigas
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
