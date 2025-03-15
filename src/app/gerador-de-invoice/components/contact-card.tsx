"use client";

import { ContactInfo } from "@/app/gerador-de-invoice/types";
import { TrashButton } from "@/components/trash-button";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

interface ContactCardProps {
  type: "vendor" | "customer";
  info: ContactInfo;
  onSelect: (info: ContactInfo) => void;
}

const NEW_CONTACT_VALUE = "NEW_CONTACT";
const EMPTY_CONTACT = {
  name: "",
  streetAddress: "",
  cityStateZip: "",
  email: "",
};

export function ContactCard({ type, info, onSelect }: ContactCardProps) {
  const [savedContacts, setSavedContacts] = useLocalStorage<ContactInfo[]>(
    `${type}Contacts`,
    []
  );
  const [contactInfo, setContactInfo] = useState(EMPTY_CONTACT);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const existingContactIndex = savedContacts.findIndex(
    (contact) => contact.email === contactInfo.email
  );

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    onSelect(contactInfo);

    // Update existing contact or add new one
    if (existingContactIndex >= 0) {
      const newContacts = [...savedContacts];
      newContacts[existingContactIndex] = contactInfo;
      setSavedContacts(newContacts);
    } else if (contactInfo.email) {
      setSavedContacts([...savedContacts, contactInfo]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (email: string) => {
    const newContacts = savedContacts.filter(
      (contact) => contact.email !== email
    );
    setSavedContacts(newContacts);
    if (contactInfo.email === email) {
      onSelect(EMPTY_CONTACT);
      setContactInfo(EMPTY_CONTACT);
    }
    setIsDialogOpen(false);
  };

  const handleCreateNew = (inputName: string) => {
    setContactInfo({
      ...EMPTY_CONTACT,
      name: inputName,
    });
    setIsDialogOpen(true);
  };

  const comboboxOptions = [
    ...savedContacts.map((contact) => ({
      value: contact.email,
      label: `${contact.name} (${contact.email})`,
    })),
    {
      value: NEW_CONTACT_VALUE,
      label: `Adicionar novo ${type === "vendor" ? "empresa" : "cliente"}`,
    },
  ];

  return (
    <div className="space-y-4 flex-1">
      <div className="space-y-1">
        <div className="flex gap-2 items-center">
          <Combobox
            label={type === "vendor" ? "Empresa" : "Cliente"}
            inputName="contact-combobox"
            value={info.email}
            onQueryChange={(query) => {
              console.log("query", query);
            }}
            onValueChange={(email) => {
              console.log("email", email);
              if (email === NEW_CONTACT_VALUE) {
                setIsDialogOpen(true);
                setContactInfo({
                  name: "",
                  streetAddress: "",
                  cityStateZip: "",
                  email: "",
                });
                return;
              }

              const selectedContact = savedContacts.find(
                (contact) => contact.email === email
              );
              if (selectedContact) {
                onSelect(selectedContact);
              }
            }}
            options={comboboxOptions}
            placeholder={`Selecionar ${type === "vendor" ? "empresa" : "cliente"}...`}
            className="flex-1"
            extraActions={
              info.email && (
                <TrashButton
                  onClick={() => handleDelete(info.email)}
                  ariaLabel={`Deletar ${type === "vendor" ? "empresa" : "cliente"}`}
                />
              )
            }
            onCreateNew={handleCreateNew}
            createNewLabel={`Adicionar ${type === "vendor" ? "empresa" : "cliente"}`}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent
              className="nice-scrollbar max-h-[80vh] overflow-auto"
              aria-describedby="Editar informações do cliente"
            >
              <DialogHeader>
                <DialogTitle>
                  {type === "vendor"
                    ? "Informações da empresa"
                    : "Informações do cliente"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-6">
                {/* Edit Form */}
                <div className="space-y-4">
                  <span className="font-semibold">
                    {existingContactIndex >= 0
                      ? type === "vendor"
                        ? "Editar informações da empresa"
                        : "Editar informações do cliente"
                      : type === "vendor"
                        ? "Adicionar nova empresa"
                        : "Adicionar novo cliente"}
                  </span>
                  <div className="space-y-4">
                    <div className="grid items-center gap-2">
                      <Label htmlFor="name">
                        Nome {type === "vendor" ? "da empresa" : "do cliente"}
                      </Label>
                      <Input
                        id="name"
                        placeholder="Nome"
                        value={contactInfo.name}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="streetAddress">
                        Endereço{" "}
                        {type === "vendor" ? "da empresa" : "do cliente"}
                      </Label>
                      <Input
                        id="streetAddress"
                        placeholder="Endereço linha 1"
                        value={contactInfo.streetAddress}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            streetAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="cityStateZip">
                        Complemento do endereço{" "}
                        {type === "vendor" ? "da empresa" : "do cliente"}
                      </Label>
                      <Input
                        id="cityStateZip"
                        placeholder="Endereço linha 2"
                        value={contactInfo.cityStateZip}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            cityStateZip: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={contactInfo.email}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Salvar</Button>
                    {existingContactIndex >= 0 && (
                      <TrashButton
                        onClick={() => handleDelete(contactInfo.email)}
                        ariaLabel={`Deletar ${type === "vendor" ? "empresa" : "cliente"}`}
                      />
                    )}
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Preview */}
      {info.email && (
        <button
          className={cn(
            "space-y-1 p-4 rounded-lg border border-dashed border-slate-700 hover:border-primary transition-colors focus:border-primary focus:outline-none min-w-full text-left"
          )}
          onClick={() => {
            setContactInfo(info);
            setIsDialogOpen(true);
          }}
          type="button"
        >
          <p className="text-lg font-semibold flex justify-between">
            {info.name}
            <Edit className="w-4 h-4" />
          </p>
          <p className="text-sm text-slate-400">{info.streetAddress}</p>
          <p className="text-sm text-slate-400">{info.cityStateZip}</p>
          <p className="text-sm text-slate-400">{info.email}</p>
        </button>
      )}
    </div>
  );
}
