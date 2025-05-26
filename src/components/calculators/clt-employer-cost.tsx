import {
  DataForm,
  DataFormHeader,
  DataFormInfoRow,
} from "@/components/data-forms";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { formatCurrency } from "@/lib/utils";
import {
  calculateEmployerCost,
  CalculationResults,
} from "@/use-cases/calculator/salary-calculations";
import { Building2 } from "lucide-react";

interface Props {
  results: CalculationResults;
  withPJComparison?: boolean;
}

export function CltEmployerCost({ results, withPJComparison = true }: Props) {
  const employerCost = calculateEmployerCost(results.clt);

  return (
    <ExpandableCard
      title="Custos para o empregador"
      icon={<Building2 className="size-5 text-primary" />}
    >
      <div className="space-y-4">
        <p className="text-secondary-text">
          Esses números são uma estimativa com base nas leis atuais brasileiras.
          Ainda assim, é importante consultar um advogado ou contador para
          verificar se os valores estão corretos e se há outras deduções ou
          contribuições obrigatórias.
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
            value={formatCurrency(employerCost.mandatoryContributions.systemS)}
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
              value={formatCurrency(employerCost.benefits.transportAllowance)}
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
            value={
              <>
                <span>{formatCurrency(employerCost.monthlyCosts.total)}</span>
                <span className="text-tertiary-text text-xs">
                  {(
                    employerCost.monthlyCosts.total / results.clt.grossSalary
                  ).toFixed(2)}
                  x o salário base ({formatCurrency(results.clt.grossSalary)})
                </span>
              </>
            }
            className="font-semibold text-accent-secondary flex flex-col items-end gap-1"
          />

          {withPJComparison && (
            <>
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
            </>
          )}
        </DataForm>
      </div>
    </ExpandableCard>
  );
}
