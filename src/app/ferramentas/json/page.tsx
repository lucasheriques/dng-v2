"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{
    isValid: boolean;
    message: string;
    color: string;
  }>({
    isValid: true,
    message: "Digite ou cole seu JSON",
    color: "text-muted-foreground",
  });
  const [indentation, setIndentation] = useState("2");
  const { toast } = useToast();

  useEffect(() => {
    if (!input.trim()) {
      setStatus({
        isValid: true,
        message: "Digite ou cole seu JSON",
        color: "text-muted-foreground",
      });
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, Number(indentation));
      setOutput(formatted);
      setStatus({
        isValid: true,
        message: "JSON válido ✓",
        color: "text-green-500",
      });
    } catch (error) {
      if (error instanceof Error) {
        setStatus({
          isValid: false,
          message: `Erro de sintaxe: ${error.message}`,
          color: "text-red-500",
        });
      }
      setOutput("");
    }
  }, [input, indentation]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast({
        title: "JSON copiado para a área de transferência!",
      });
    } catch {
      toast({
        title: "Erro ao copiar para a área de transferência",
      });
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus({
      isValid: true,
      message: "Digite ou cole seu JSON",
      color: "text-muted-foreground",
    });
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Formatador JSON</h1>
        <Select value={indentation} onValueChange={setIndentation}>
          <SelectTrigger className="w-32 bg-teal-900">
            <SelectValue placeholder="Indentação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 espaços</SelectItem>
            <SelectItem value="4">4 espaços</SelectItem>
            <SelectItem value="8">8 espaços</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={`text-sm mb-2 ${status.color}`}>{status.message}</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
          <Textarea
            placeholder="Cole seu JSON aqui..."
            className="flex-1 font-mono resize-none bg-slate-900/50 border-slate-800 scrollbar-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
          <div
            className="flex-1 overflow-auto bg-slate-900/50 rounded-md scrollbar-none"
            onDoubleClick={handleCopy}
          >
            {status.isValid && output ? (
              <SyntaxHighlighter
                language="json"
                style={{
                  ...oneDark,
                  'pre[class*="language-"]': {
                    ...oneDark['pre[class*="language-"]'],
                    background: "transparent",
                  },
                  'code[class*="language-"]': {
                    ...oneDark['code[class*="language-"]'],
                    background: "transparent",
                  },
                }}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  background: "transparent",
                  minHeight: "100%",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                {output}
              </SyntaxHighlighter>
            ) : (
              <div className={`h-full ${!status.isValid && "opacity-50"}`}>
                <Textarea
                  readOnly
                  placeholder="JSON formatado aparecerá aqui..."
                  className="h-full font-mono resize-none bg-transparent border-0 scrollbar-none"
                  value={output}
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
