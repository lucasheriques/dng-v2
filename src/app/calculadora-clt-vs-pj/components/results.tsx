import { ComparisonCard } from "@/app/calculadora-clt-vs-pj/components/comparison-card";
import {
  DataForm,
  DataFormHeader,
  DataFormInfoRow,
} from "@/components/data-forms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
  calculateEmployerCost,
  CalculationResults,
  findCLTEquivalentForPJ,
  findPJEquivalentForCLT,
} from "@/use-cases/calculator/salary-calculations";
import { CalculatorFormData } from "@/use-cases/calculator/types";
import { CheckCircle, Share2 } from "lucide-react";

interface ResultsProps {
  results: CalculationResults;
  formData: CalculatorFormData;
  onShare: () => void;
}

export default function Results({ results, formData, onShare }: ResultsProps) {
  const monthlyDifference = results.pj.total - results.clt.total;
  const yearlyDifference = monthlyDifference * 12;
  const betterOption = monthlyDifference > 0 ? "PJ" : "CLT";

  const employerCost = calculateEmployerCost(results.clt);

  // Calculate relative increase
  const relativeIncrease =
    (Math.abs(monthlyDifference) /
      Math.min(results.clt.total, results.pj.total)) *
    100;

  // Calculate equivalent values using the new functions
  const cltToPJEquivalent = findPJEquivalentForCLT(results.clt.total, formData);
  const pjToCLTEquivalent = findCLTEquivalentForPJ(results.pj.total, formData);

  return (
    <div className="space-y-4 relative w-full overflow-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comparação CLT vs PJ</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Regime</TableHead>
            <TableHead className="text-right w-[250px]">
              Salário Líquido Mensal
            </TableHead>
            <TableHead className="text-right w-[250px]">
              Salário Líquido Anual
            </TableHead>
            <TableHead className="text-right w-[250px]">Equivalente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="">CLT</TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(results.clt.total)}
            </TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(results.clt.total * 12)}
            </TableCell>
            <TableCell className="text-right w-[250px] ">
              Valor PJ: {formatCurrency(cltToPJEquivalent)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="">PJ</TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(results.pj.total)}
            </TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(results.pj.total * 12)}
            </TableCell>
            <TableCell className="text-right w-[250px] ">
              Valor CLT: {formatCurrency(pjToCLTEquivalent)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Card className="dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-200">
            <CheckCircle size={20} /> Melhor opção: {betterOption}
          </CardTitle>
          <Button
            size="sm"
            onClick={onShare}
            className="col-span-4 self-center"
          >
            <Share2 className="size-4 mr-2" />
            Compartilhar resultado
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <p className="text-xs text-emerald-50">Diferença mensal</p>
              <p className="text-lg font-medium text-primary">
                {formatCurrency(Math.abs(monthlyDifference))}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-50">Diferença anual</p>
              <p className="text-lg font-medium text-primary">
                {formatCurrency(Math.abs(yearlyDifference))}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-50">Aumento relativo</p>
              <p className="text-lg font-medium text-primary">
                {relativeIncrease.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-50">
                Equivalente {betterOption === "PJ" ? "CLT" : "PJ"}
              </p>
              <p className="text-lg font-medium text-primary">
                {formatCurrency(
                  betterOption === "PJ" ? pjToCLTEquivalent : cltToPJEquivalent
                )}
              </p>
            </div>
          </div>{" "}
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="employer-cost">
          <AccordionTrigger>
            <h3>Custo para o empregador</h3>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-secondary-text pb-4">
              Esses números são uma estimativa com base nas leis atuais
              brasileiras. Ainda assim, é importante consultar um advogado ou
              contador para verificar se os valores estão corretos e se há
              outras deduções ou contribuições obrigatórias.
            </p>
            <DataForm>
              <DataFormHeader>
                <h3>CLT</h3>
              </DataFormHeader>
              <DataFormInfoRow
                label="Salário base"
                value={formatCurrency(employerCost.grossSalary)}
                type="addition"
                className="text-sm"
                tooltipContent="Valor bruto do salário mensal antes de impostos e deduções."
              />
              <DataFormInfoRow
                label="INSS (Patronal)"
                value={formatCurrency(employerCost.mandatoryContributions.inss)}
                type="addition"
                className="text-sm"
                tooltipContent="Contribuição do empregador para a Previdência Social (20% sobre o salário base)."
              />
              <DataFormInfoRow
                label="FGTS"
                value={formatCurrency(employerCost.mandatoryContributions.fgts)}
                type="addition"
                className="text-sm"
                tooltipContent="Fundo de Garantia por Tempo de Serviço (8% sobre o salário base)."
              />
              <DataFormInfoRow
                label="RAT"
                value={formatCurrency(employerCost.mandatoryContributions.rat)}
                type="addition"
                className="text-sm"
                tooltipContent="Seguro de Acidente de Trabalho (alíquota varia de 1% a 3% conforme o risco da atividade). Aqui estou usando a alíquota de 1%."
              />
              <DataFormInfoRow
                label="Sistema S"
                value={formatCurrency(
                  employerCost.mandatoryContributions.systemS
                )}
                type="addition"
                className="text-sm"
                tooltipContent="Contribuições para entidades como SESI, SENAI, SESC, SENAC (alíquota varia conforme o setor). Aqui estou usando a alíquota do SENAI de 5,8%."
              />
              <DataFormInfoRow
                label="13º Salário (provisão mensal)"
                value={formatCurrency(
                  employerCost.mandatoryContributions.monthlyThirteenthSalary
                )}
                type="addition"
                className="text-sm"
                tooltipContent="Valor mensal provisionado para pagamento do 13º salário anual."
              />
              <DataFormInfoRow
                label="Encargos sobre 13º (provisão mensal)"
                value={formatCurrency(
                  employerCost.mandatoryContributions.monthlyThirteenthCharges
                )}
                type="addition"
                className="text-sm"
                tooltipContent="INSS, FGTS, RAT e Sistema S incidentes sobre o 13º salário, provisionados mensalmente."
              />
              <DataFormInfoRow
                label="Férias (provisão mensal)"
                value={formatCurrency(
                  employerCost.mandatoryContributions.monthlyVacationSalary
                )}
                type="addition"
                className="text-sm"
                tooltipContent="Valor mensal provisionado para pagamento das férias anuais."
              />
              <DataFormInfoRow
                label="Adicional de Férias (provisão mensal)"
                value={formatCurrency(
                  employerCost.mandatoryContributions.monthlyVacationBonus
                )}
                type="addition"
                className="text-sm"
                tooltipContent="Valor mensal provisionado para o adicional de 1/3 sobre as férias."
              />
              <DataFormInfoRow
                label="Encargos sobre Férias (provisão mensal)"
                value={formatCurrency(
                  employerCost.mandatoryContributions.monthlyVacationCharges
                )}
                type="addition"
                className="text-sm"
                tooltipContent="INSS, FGTS, RAT e Sistema S incidentes sobre as férias e o adicional, provisionados mensalmente."
              />

              {/* Add individual benefit rows */}
              {employerCost.benefits.transportAllowance > 0 && (
                <DataFormInfoRow
                  label="Vale Transporte"
                  value={formatCurrency(
                    employerCost.benefits.transportAllowance
                  )}
                  type="addition"
                  className="text-sm"
                  tooltipContent="Custo do vale transporte fornecido ao funcionário."
                />
              )}
              {employerCost.benefits.mealAllowance > 0 && (
                <DataFormInfoRow
                  label="Vale Refeição/Alimentação"
                  value={formatCurrency(employerCost.benefits.mealAllowance)}
                  type="addition"
                  className="text-sm"
                  tooltipContent="Custo do vale refeição ou alimentação fornecido ao funcionário."
                />
              )}
              {employerCost.benefits.healthInsurance > 0 && (
                <DataFormInfoRow
                  label="Plano de Saúde (Empregador)"
                  value={formatCurrency(employerCost.benefits.healthInsurance)}
                  type="addition"
                  className="text-sm"
                  tooltipContent="Custo do plano de saúde (parte do empregador)."
                />
              )}
              {employerCost.benefits.otherBenefits > 0 && (
                <DataFormInfoRow
                  label="Outros Benefícios"
                  value={formatCurrency(employerCost.benefits.otherBenefits)}
                  type="addition"
                  className="text-sm"
                  tooltipContent="Custo de outros benefícios acordados (Ex: auxílio creche, seguro de vida)."
                />
              )}
              <DataFormInfoRow
                label="Total mensal"
                value={formatCurrency(employerCost.monthlyCosts.total)}
                className="font-semibold text-accent-secondary"
              />

              <DataFormHeader>
                <h3>PJ</h3>
              </DataFormHeader>
              <DataFormInfoRow
                label="Custo mensal"
                value={formatCurrency(
                  results.pj.grossSalary +
                    results.pj.benefits.nonTaxable +
                    results.pj.benefits.taxable
                )}
                tooltipContent="Faturamento mensal do PJ, mais benefícios que você pode oferecer no contrato."
              />
              <DataFormInfoRow
                label="Economia comparado à CLT"
                value={formatCurrency(
                  employerCost.monthlyCosts.total -
                    (results.pj.grossSalary +
                      results.pj.benefits.nonTaxable +
                      results.pj.benefits.taxable)
                )}
                className="font-semibold text-emerald-400"
                tooltipContent="Não contrate PJ querendo um funcionário CLT mais barato. Isso dá processo trabalhista e é ilegal. PJ não deve ser usado como substituto de CLT. Na dúvida, consulte um advogado."
              />
            </DataForm>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ComparisonCard results={results} />
    </div>
  );
}
