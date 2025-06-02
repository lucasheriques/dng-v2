import { ComparisonCard } from "@/app/calculadora-clt-vs-pj/components/comparison-card";
import {
  DataForm,
  DataFormHeader,
  DataFormInfoRow,
} from "@/components/data-forms";
import { ExpandableCard } from "@/components/ui/expandable-card";
import {
  FancyCard,
  FancyCardFooter,
  FancyCardTitle,
} from "@/components/ui/fancy-card";
import { ShareButton } from "@/components/ui/share-button";
import { formatCurrency } from "@/lib/utils";
import {
  calculateEmployerCost,
  CalculationResults,
  findCLTEquivalentForPJ,
  findPJEquivalentForCLT,
} from "@/use-cases/calculator/salary-calculations";
import { CalculatorFormData } from "@/use-cases/calculator/types";
import { Building2, CheckCircle } from "lucide-react";

interface ResultsProps {
  results: CalculationResults;
  formData: CalculatorFormData;
  onShare: () => Promise<boolean>;
}

export default function CltPjResults({
  results,
  formData,
  onShare,
}: ResultsProps) {
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
    <div className="space-y-4 scroll-mt-20" id="clt-pj-comparison">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comparação CLT vs PJ</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FancyCard colorTheme="blue">
          <FancyCardTitle title="CLT" />
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-secondary-text">
                Salário Líquido + Benefícios
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(results.clt.total)}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary-text">
                Total Anual (Líquido + Benefícios)
              </p>
              <p className="text-lg font-semibold text-main-text">
                {formatCurrency(results.clt.total * 12)}
              </p>
            </div>
            <FancyCardFooter>
              <p className="text-xs text-secondary-text">
                Para ter a mesma renda como PJ
              </p>
              <p className="text-lg font-semibold text-blue-400">
                {formatCurrency(cltToPJEquivalent)}
              </p>
              <p className="text-xs text-tertiary-text">
                faturamento mensal necessário
              </p>
            </FancyCardFooter>
          </div>
        </FancyCard>

        <FancyCard colorTheme="purple">
          <FancyCardTitle title="PJ" />
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-secondary-text">
                Renda Líquida Mensal
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(results.pj.total)}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary-text">Renda Líquida Anual</p>
              <p className="text-lg font-semibold text-main-text">
                {formatCurrency(results.pj.total * 12)}
              </p>
            </div>
            <FancyCardFooter>
              <p className="text-xs text-secondary-text">
                Para ter a mesma renda como CLT
              </p>
              <p className="text-lg font-semibold text-purple-400">
                {formatCurrency(pjToCLTEquivalent)}
              </p>
              <p className="text-xs text-tertiary-text">
                salário bruto mensal necessário
              </p>
            </FancyCardFooter>
          </div>
        </FancyCard>
      </div>

      <FancyCard colorTheme="emerald">
        <FancyCardTitle
          title={`Melhor opção: ${betterOption}`}
          icon={<CheckCircle size={16} />}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs text-secondary-text">Diferença mensal</p>
            <p className="text-lg font-medium text-primary">
              {formatCurrency(Math.abs(monthlyDifference))}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary-text">Diferença anual</p>
            <p className="text-lg font-medium text-primary">
              {formatCurrency(Math.abs(yearlyDifference))}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary-text">Aumento relativo</p>
            <p className="text-lg font-medium text-primary">
              {relativeIncrease.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary-text">
              Equivalente {betterOption === "PJ" ? "CLT" : "PJ"}
            </p>
            <p className="text-lg font-medium text-primary">
              {formatCurrency(
                betterOption === "PJ" ? pjToCLTEquivalent : cltToPJEquivalent
              )}
            </p>
          </div>
        </div>
        <FancyCardFooter>
          <div className="flex justify-center">
            <ShareButton onShare={onShare} className="self-center" />
          </div>
        </FancyCardFooter>
      </FancyCard>

      <ExpandableCard
        title="Custos para o empregador"
        icon={<Building2 className="size-5 text-primary" />}
      >
        <div className="space-y-4">
          <p className="text-secondary-text">
            Esses números são uma estimativa com base nas leis atuais
            brasileiras. Ainda assim, é importante consultar um advogado ou
            contador para verificar se os valores estão corretos e se há outras
            deduções ou contribuições obrigatórias.
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
        </div>
      </ExpandableCard>

      <ComparisonCard results={results} />
    </div>
  );
}
