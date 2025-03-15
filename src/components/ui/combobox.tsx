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
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
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
  onCreateNew?: (inputValue: string) => void;
  createNewLabel?: React.ReactNode;
  onQueryChange?: (query: string) => void;
}

const CREATE_NEW_VALUE = "__create_new__";

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
  onCreateNew,
  createNewLabel = "Adicionar novo",
  onQueryChange,
}: ComboboxProps) {
  const [query, setQuery] = React.useState("");

  // Reset query when combobox is closed
  const handleComboboxClose = React.useCallback(() => {
    // Reset query to show the full list of options next time it's opened
    setQuery("");

    // If a value is selected, we want to show its label
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      // We don't need to do anything here as displayValue will handle showing the label
    }
  }, [value, options]);

  // Handle value change including the special create new case
  const handleValueChange = (newValue: string) => {
    if (newValue === CREATE_NEW_VALUE && onCreateNew) {
      onCreateNew(query);
      return;
    }
    onValueChange(newValue);
  };

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Field className={"flex flex-col gap-2 flex-1"}>
      {label && <HeadlessLabel>{label}</HeadlessLabel>}
      <HeadlessCombobox
        value={value}
        onChange={handleValueChange}
        disabled={disabled}
        onClose={handleComboboxClose}
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
                  onChange={(event) => {
                    const newValue = event.target.value;
                    setQuery(newValue);
                    onQueryChange?.(newValue);
                  }}
                  onKeyDown={(event) => {
                    // Prevent the default behavior for space key
                    // which might be intercepted by HeadlessUI
                    if (event.key === " ") {
                      event.stopPropagation();
                    }
                  }}
                  placeholder={placeholder}
                  displayValue={(currentValue: string) => {
                    const selectedOption = options.find(
                      (option) => option.value === currentValue
                    );
                    return selectedOption ? selectedOption.label : query;
                  }}
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
              <>
                {onCreateNew ? (
                  <ComboboxOption
                    className={({ active }) =>
                      cn(
                        "relative cursor-pointer select-none py-2 pl-10 pr-4",
                        active ? "bg-accent text-accent-foreground" : ""
                      )
                    }
                    value={CREATE_NEW_VALUE}
                  >
                    {() => (
                      <>
                        <span
                          className={cn(
                            "block truncate font-medium text-primary"
                          )}
                        >
                          {createNewLabel}: &quot;{query}&quot;
                        </span>
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3 text-primary"
                          )}
                        >
                          <PlusCircle className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </>
                    )}
                  </ComboboxOption>
                ) : (
                  <div className="relative cursor-default select-none px-4 py-2 text-slate-400">
                    {emptyText}
                  </div>
                )}
              </>
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
