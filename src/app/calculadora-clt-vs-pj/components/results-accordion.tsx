import {
  DetailRow,
  TableHeader,
  TableRow,
} from "@/app/calculadora-clt-vs-pj/components/table-inputs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/utils";
import { CalculationResults } from "../types";

export default function ResultsAccordion({
  results,
  type,
  isExpanded,
  onToggle,
}: {
  results: CalculationResults;
  type: "clt" | "pj";
  isExpanded: boolean;
  onToggle: () => void;
}) {
  if (type === "clt") {
    return (
      <div>
        <TableHeader>Resultados</TableHeader>
        <TableRow
          label="Salário Líquido Mensal"
          className="font-semibold"
          tooltipContent="Esse é o valor que vai entrar na sua conta, todo mês, depois de todos os descontos, sem contar com os benefícios."
        >
          <div className="px-3 py-2 text-right">
            {formatCurrency(results.clt.netSalary)}
          </div>
        </TableRow>
        <TableRow
          label="Salário Líquido + Benefícios Acumulados"
          className="font-semibold text-emerald-400"
        >
          <div className="px-3 py-2 text-right">
            {formatCurrency(results.clt.total)}
          </div>
        </TableRow>
        <Accordion
          type="single"
          value={isExpanded ? "details" : ""}
          className="w-full"
        >
          <AccordionItem value="details" className="border-0">
            <AccordionTrigger
              className="hover:no-underline px-3 py-2 text-sm bg-slate-600/50"
              onClick={onToggle}
            >
              {isExpanded
                ? "Ocultar cálculo detalhado"
                : "Ver cálculo detalhado"}
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <DetailRow
                label="Salário Bruto Mensal"
                value={formatCurrency(results.clt.grossSalary)}
                type="addition"
              />
              <TableHeader>Benefícios</TableHeader>
              {results.clt.detailedBenefits.transportAllowance > 0 && (
                <DetailRow
                  label="Vale-Transporte"
                  value={formatCurrency(
                    results.clt.detailedBenefits.transportAllowance
                  )}
                  type="addition"
                />
              )}
              {results.clt.detailedBenefits.mealAllowance > 0 && (
                <DetailRow
                  label="Vale Refeição/Alimentação"
                  value={formatCurrency(
                    results.clt.detailedBenefits.mealAllowance
                  )}
                  type="addition"
                />
              )}
              {results.clt.detailedBenefits.healthInsurance > 0 && (
                <DetailRow
                  label="Plano de Saúde"
                  value={formatCurrency(
                    results.clt.detailedBenefits.healthInsurance
                  )}
                  type="addition"
                />
              )}
              {results.clt.detailedBenefits.otherBenefits > 0 && (
                <DetailRow
                  label="Outros Benefícios"
                  value={formatCurrency(
                    results.clt.detailedBenefits.otherBenefits
                  )}
                  type="addition"
                />
              )}
              <DetailRow
                label="13º Salário (proporcional)"
                value={formatCurrency(
                  results.clt.detailedBenefits.thirteenthSalary
                )}
                type="addition"
              />
              <DetailRow
                label="Férias (proporcional)"
                value={formatCurrency(
                  results.clt.detailedBenefits.vacationBonus
                )}
                type="addition"
              />
              {results.clt.detailedBenefits.plrGross > 0 && (
                <DetailRow
                  label="PLR (proporcional)"
                  value={formatCurrency(
                    results.clt.detailedBenefits.plrGross / 12
                  )}
                  type="addition"
                />
              )}
              <DetailRow
                label={
                  results.clt.includeFGTS
                    ? "FGTS Mensal"
                    : "FGTS Mensal (não incluso na soma)"
                }
                value={formatCurrency(results.clt.detailedBenefits.fgts)}
                type={results.clt.includeFGTS ? "addition" : "neutral"}
              />
              {results.clt.detailedBenefits.severance > 0 && (
                <DetailRow
                  label="Indenização em caso de demissão"
                  tooltipContent="Valor mensal proporcional da multa de 40% do FGTS em caso de demissão sem justa causa"
                  value={formatCurrency(results.clt.detailedBenefits.severance)}
                  type="neutral"
                  className="text-slate-100"
                />
              )}

              <TableHeader>Deduções</TableHeader>
              <DetailRow
                label="INSS"
                value={formatCurrency(results.clt.deductions.inss)}
                type="deduction"
              />
              <DetailRow
                label="IRPF"
                value={formatCurrency(results.clt.deductions.ir)}
                type="deduction"
              />
              {results.clt.detailedBenefits.transportDeduction > 0 && (
                <DetailRow
                  label="Desconto VT (6%)"
                  value={formatCurrency(
                    results.clt.detailedBenefits.transportDeduction
                  )}
                  type="deduction"
                />
              )}
              {results.clt.deductions.plrTax > 0 && (
                <DetailRow
                  label="Desconto PLR (IRPF)"
                  value={formatCurrency(results.clt.deductions.plrTax / 12)}
                  type="deduction"
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  const isThereAnyPJBenefits =
    results.pj.benefits.taxable > 0 || results.pj.benefits.nonTaxable > 0;

  return (
    <div>
      <TableHeader>Resultados</TableHeader>
      <TableRow
        label="Total Líquido"
        className={`font-semibold ${results.pj.benefits.nonTaxable > 0 ? "text-slate-200" : "text-emerald-400"}`}
      >
        <div className="px-3 py-2 text-right">
          {formatCurrency(results.pj.netSalary)}
        </div>
      </TableRow>
      {results.pj.benefits.nonTaxable > 0 && (
        <TableRow
          label="Líquido + Benefícios Não Tributáveis"
          className="font-semibold text-emerald-400"
        >
          <div className="px-3 py-2 text-right">
            {formatCurrency(results.pj.total)}
          </div>
        </TableRow>
      )}
      <Accordion
        type="single"
        value={isExpanded ? "details" : ""}
        className="w-full"
      >
        <AccordionItem value="details" className="border-0">
          <AccordionTrigger
            className="hover:no-underline px-3 py-2 text-sm bg-slate-600/50"
            onClick={onToggle}
          >
            {isExpanded ? "Ocultar cálculo detalhado" : "Ver cálculo detalhado"}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <DetailRow
              label="Faturamento Bruto"
              value={formatCurrency(results.pj.grossSalary)}
              type="addition"
            />
            {isThereAnyPJBenefits && <TableHeader>Benefícios</TableHeader>}
            {results.pj.benefits.taxable > 0 && (
              <DetailRow
                label="Benefícios Tributáveis"
                value={formatCurrency(results.pj.benefits.taxable)}
                type="addition"
              />
            )}
            {results.pj.benefits.nonTaxable > 0 && (
              <DetailRow
                label="Benefícios Não Tributáveis"
                value={formatCurrency(results.pj.benefits.nonTaxable)}
                type="addition"
              />
            )}

            <TableHeader>Deduções</TableHeader>
            <DetailRow
              label="Impostos"
              value={formatCurrency(results.pj.deductions.taxes)}
              type="deduction"
            />
            <DetailRow
              label="Honorários Contador"
              value={formatCurrency(results.pj.deductions.accountingFee)}
              type="deduction"
            />
            <DetailRow
              label="INSS Pró-Labore"
              value={formatCurrency(results.pj.deductions.inssContribution)}
              type="deduction"
            />
            {results.pj.deductions.otherExpenses > 0 && (
              <DetailRow
                label="Outras Despesas"
                value={formatCurrency(results.pj.deductions.otherExpenses)}
                type="deduction"
              />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
