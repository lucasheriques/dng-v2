"use client";

import { HeadlessLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Combobox as HeadlessCombobox,
} from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  inputName?: string;
  label?: string;
  extraActions?: React.ReactNode;
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Selecione uma opção...",
  emptyText = "Nenhuma opção encontrada.",
  inputName,
  className,
  disabled,
  label,
  extraActions,
}: ComboboxProps) {
  const [query, setQuery] = React.useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Field className={"flex flex-col gap-2 flex-1"}>
      {label && <HeadlessLabel>{label}</HeadlessLabel>}
      <HeadlessCombobox
        value={value}
        onChange={onValueChange}
        disabled={disabled}
      >
        <div className="relative flex-1">
          <div className="flex items-center gap-2">
            <ComboboxButton className="w-full">
              <div
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  className
                )}
              >
                <ComboboxInput
                  className="w-full border-none bg-transparent p-0 focus:outline-none focus:ring-0"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={placeholder}
                  displayValue={(value: string) =>
                    options.find((option) => option.value === value)?.label ??
                    ""
                  }
                  name={inputName}
                />
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </div>
            </ComboboxButton>
            {extraActions}
          </div>

          <ComboboxOptions
            transition
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-700 bg-background py-1 shadow-lg focus:outline-none origin-top transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0 text-base md:text-sm"
          >
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-slate-400">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <ComboboxOption
                  key={option.value}
                  className={({ active }) =>
                    cn(
                      "relative cursor-default select-none py-2 pl-10 pr-4 ",
                      active ? "bg-accent text-accent-foreground" : ""
                    )
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={cn(
                          "block truncate",
                          selected ? "font-medium text-white" : "font-normal"
                        )}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            active ? "text-white" : "text-primary"
                          )}
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </HeadlessCombobox>
    </Field>
  );
}
