import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { CLTResults } from "@/use-cases/calculator/salary-calculations";
import { Info } from "lucide-react";

interface CltResultsBreakdownProps {
  results: CLTResults;
}

export default function CltResultsBreakdown({
  results,
}: CltResultsBreakdownProps) {
  return (
    <Card className="border rounded-t-none bg-accent border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="size-4" />
          Detalhamento Completo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          <AccordionItem value="deductions">
            <AccordionTrigger className="text-sm">
              Descontos (
              {formatCurrency(
                results.deductions.inss +
                  results.deductions.ir +
                  results.deductions.transportDeduction +
                  results.deductions.otherCltExpenses +
                  results.deductions.alimony
              )}
              )
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-text">INSS:</span>
                  <span className="font-medium text-rose-300">
                    -{formatCurrency(results.deductions.inss)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-text">Imposto de Renda:</span>
                  <span className="font-medium text-rose-300">
                    -{formatCurrency(results.deductions.ir)}
                  </span>
                </div>
                {results.deductions.transportDeduction > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">
                      Vale-Transporte:
                    </span>
                    <span className="font-medium text-rose-300">
                      -{formatCurrency(results.deductions.transportDeduction)}
                    </span>
                  </div>
                )}
                {results.deductions.alimony > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">
                      Pensão Alimentícia:
                    </span>
                    <span className="font-medium text-rose-300">
                      -{formatCurrency(results.deductions.alimony)}
                    </span>
                  </div>
                )}

                {results.deductions.otherCltExpenses > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">
                      Outros Descontos:
                    </span>
                    <span className="font-medium text-rose-300">
                      -{formatCurrency(results.deductions.otherCltExpenses)}
                    </span>
                  </div>
                )}
                {results.deductions.plrTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">Imposto PLR:</span>
                    <span className="font-medium text-rose-300">
                      -{formatCurrency(results.deductions.plrTax)}
                    </span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="benefits">
            <AccordionTrigger className="text-sm">
              Benefícios Mensais ({formatCurrency(results.benefits)})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-text">
                    13º salário (proporcional):
                  </span>
                  <span className="font-medium text-green-300">
                    +
                    {formatCurrency(
                      results.detailedBenefits?.thirteenthSalary || 0
                    )}
                  </span>
                </div>
                {results.detailedBenefits?.mealAllowance > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">Vale Refeição:</span>
                    <span className="font-medium text-green-300">
                      +{formatCurrency(results.detailedBenefits.mealAllowance)}
                    </span>
                  </div>
                )}
                {results.detailedBenefits?.transportAllowance > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">
                      Vale Transporte:
                    </span>
                    <span className="font-medium text-green-300">
                      +
                      {formatCurrency(
                        results.detailedBenefits.transportAllowance
                      )}
                    </span>
                  </div>
                )}
                {results.detailedBenefits?.healthInsurance > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">Plano de Saúde:</span>
                    <span className="font-medium text-green-300">
                      +
                      {formatCurrency(results.detailedBenefits.healthInsurance)}
                    </span>
                  </div>
                )}
                {results.detailedBenefits?.otherBenefits > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">
                      Outros Benefícios:
                    </span>
                    <span className="font-medium text-green-300">
                      +{formatCurrency(results.detailedBenefits.otherBenefits)}
                    </span>
                  </div>
                )}
                {results.detailedBenefits?.plrNet > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">PLR:</span>
                    <span className="font-medium text-green-300">
                      +{formatCurrency(results.detailedBenefits.plrNet / 12)}
                    </span>
                  </div>
                )}

                {results.detailedBenefits?.fgts > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">FGTS (mensal):</span>
                    <span
                      className={cn(
                        "font-medium",
                        results.includeFGTS
                          ? "text-green-300"
                          : "text-secondary-text"
                      )}
                    >
                      {results.includeFGTS ? "+" : ""}
                      {formatCurrency(results.detailedBenefits.fgts)}
                    </span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="annual">
            <AccordionTrigger className="text-sm">
              Valores Anuais e Rescisão
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-text">
                    13º Salário Líquido:
                  </span>
                  <span className="font-medium text-blue-300">
                    {formatCurrency(
                      (results.detailedBenefits?.thirteenthSalary || 0) * 12
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-text">
                    1/3 Bônus de Férias:
                  </span>
                  <span className="font-medium text-blue-300">
                    {formatCurrency(
                      (results.detailedBenefits?.vacationBonus || 0) * 12
                    )}
                  </span>
                </div>
                {results.detailedBenefits?.plrNet > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">
                      PLR Líquido Anual:
                    </span>
                    <span className="font-medium text-blue-300">
                      {formatCurrency(results.detailedBenefits.plrNet)}
                    </span>
                  </div>
                )}
                {results.detailedBenefits?.severance > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">
                      Multa Rescisória:
                    </span>
                    <span className="font-medium text-yellow-400">
                      {formatCurrency(results.detailedBenefits.severance)}
                    </span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
