import { DataFormHeader, DataFormInfoRow } from "@/components/data-forms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/utils";
import { CalculationResults } from "@/use-cases/calculator/salary-calculations";

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
        <DataFormHeader>Resultados</DataFormHeader>
        <DataFormInfoRow
          label="Salário Líquido Mensal"
          className="font-semibold"
          tooltipContent="Esse é o valor que vai entrar na sua conta, todo mês, depois de todos os descontos, sem contar com os benefícios."
          value={formatCurrency(results.clt.netSalary)}
          type="neutral"
        />
        <DataFormInfoRow
          label="Salário Líquido + Benefícios Acumulados"
          className="font-semibold text-emerald-400"
          value={formatCurrency(results.clt.total)}
        />
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
            <AccordionContent className="pb-0 text-sm">
              <DataFormInfoRow
                label="Salário Bruto Mensal"
                value={formatCurrency(results.clt.grossSalary)}
                type="addition"
              />
              <DataFormHeader>Benefícios</DataFormHeader>
              {results.clt.detailedBenefits.transportAllowance > 0 && (
                <DataFormInfoRow
                  label="Vale-Transporte"
                  value={formatCurrency(
                    results.clt.detailedBenefits.transportAllowance
                  )}
                  type="addition"
                />
              )}
              {results.clt.detailedBenefits.mealAllowance > 0 && (
                <DataFormInfoRow
                  label="Vale Refeição/Alimentação"
                  value={formatCurrency(
                    results.clt.detailedBenefits.mealAllowance
                  )}
                  type="addition"
                />
              )}
              {results.clt.detailedBenefits.healthInsurance > 0 && (
                <DataFormInfoRow
                  label="Plano de Saúde"
                  value={formatCurrency(
                    results.clt.detailedBenefits.healthInsurance
                  )}
                  type="addition"
                />
              )}
              {results.clt.detailedBenefits.otherBenefits > 0 && (
                <DataFormInfoRow
                  label="Outros Benefícios"
                  value={formatCurrency(
                    results.clt.detailedBenefits.otherBenefits
                  )}
                  type="addition"
                />
              )}
              <DataFormInfoRow
                label="13º Salário (proporcional)"
                value={formatCurrency(
                  results.clt.detailedBenefits.thirteenthSalary
                )}
                type="addition"
              />
              <DataFormInfoRow
                label="Férias (proporcional)"
                value={formatCurrency(
                  results.clt.detailedBenefits.vacationBonus
                )}
                type="addition"
              />
              {results.clt.detailedBenefits.plrGross > 0 && (
                <DataFormInfoRow
                  label="PLR (proporcional)"
                  value={formatCurrency(
                    results.clt.detailedBenefits.plrGross / 12
                  )}
                  type="addition"
                />
              )}
              <DataFormInfoRow
                label={
                  results.clt.includeFGTS
                    ? "FGTS Mensal"
                    : "FGTS Mensal (não incluso na soma)"
                }
                value={formatCurrency(results.clt.detailedBenefits.fgts)}
                type={results.clt.includeFGTS ? "addition" : "neutral"}
              />
              {results.clt.detailedBenefits.severance > 0 && (
                <DataFormInfoRow
                  label="Indenização em caso de demissão"
                  tooltipContent="Valor mensal proporcional da multa de 40% do FGTS em caso de demissão sem justa causa"
                  value={formatCurrency(results.clt.detailedBenefits.severance)}
                  type="neutral"
                  className="text-slate-100"
                />
              )}

              <DataFormHeader>Deduções</DataFormHeader>
              <DataFormInfoRow
                label="INSS"
                value={formatCurrency(results.clt.deductions.inss)}
                type="deduction"
              />
              <DataFormInfoRow
                label="IRPF"
                value={formatCurrency(results.clt.deductions.ir)}
                type="deduction"
              />
              {results.clt.detailedBenefits.transportDeduction > 0 && (
                <DataFormInfoRow
                  label="Desconto VT (6%)"
                  value={formatCurrency(
                    results.clt.detailedBenefits.transportDeduction
                  )}
                  type="deduction"
                />
              )}
              {results.clt.deductions.plrTax > 0 && (
                <DataFormInfoRow
                  label="Desconto PLR (IRPF)"
                  value={formatCurrency(results.clt.deductions.plrTax / 12)}
                  type="deduction"
                />
              )}
              {results.clt.deductions.otherCltExpenses > 0 && (
                <DataFormInfoRow
                  label="Outras Despesas"
                  value={formatCurrency(
                    results.clt.deductions.otherCltExpenses
                  )}
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
      <DataFormHeader>Resultados</DataFormHeader>
      <DataFormInfoRow
        label="Total Líquido"
        className={`font-semibold ${results.pj.benefits.nonTaxable > 0 ? "text-slate-200" : "text-emerald-400"}`}
        value={formatCurrency(results.pj.netSalary)}
      />
      {results.pj.benefits.nonTaxable > 0 && (
        <DataFormInfoRow
          label="Líquido + Benefícios Não Tributáveis"
          className="font-semibold text-emerald-400"
          value={formatCurrency(results.pj.total)}
        />
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
            <DataFormInfoRow
              label="Faturamento Bruto"
              value={formatCurrency(results.pj.grossSalary)}
              type="addition"
            />
            {isThereAnyPJBenefits && (
              <DataFormHeader>Benefícios</DataFormHeader>
            )}
            {results.pj.benefits.taxable > 0 && (
              <DataFormInfoRow
                label="Benefícios Tributáveis"
                value={formatCurrency(results.pj.benefits.taxable)}
                type="addition"
              />
            )}
            {results.pj.benefits.nonTaxable > 0 && (
              <DataFormInfoRow
                label="Benefícios Não Tributáveis"
                value={formatCurrency(results.pj.benefits.nonTaxable)}
                type="addition"
              />
            )}

            <DataFormHeader>Deduções</DataFormHeader>
            <DataFormInfoRow
              label="Impostos"
              value={formatCurrency(results.pj.deductions.taxes)}
              type="deduction"
            />
            <DataFormInfoRow
              label="Honorários Contador"
              value={formatCurrency(results.pj.deductions.accountingFee)}
              type="deduction"
            />
            <DataFormInfoRow
              label="INSS Pró-Labore"
              value={formatCurrency(results.pj.deductions.inssContribution)}
              type="deduction"
            />
            {results.pj.deductions.otherExpenses > 0 && (
              <DataFormInfoRow
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
