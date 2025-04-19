import { ComparisonCard } from "@/app/calculadora-clt-vs-pj/components/comparison-card";
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
  findCLTEquivalentForPJ,
  findPJEquivalentForCLT,
} from "@/use-cases/calculator/salary-calculations";
import { CalculationResults, CalculatorFormData } from "../types";

interface ResultsProps {
  results: CalculationResults;
  defaultInterestRate: number;
  formData: CalculatorFormData;
}

export default function Results({
  results,
  defaultInterestRate,
  formData,
}: ResultsProps) {
  const monthlyDifference = results.pj.total - results.clt.total;
  const yearlyDifference = monthlyDifference * 12;
  const betterOption = monthlyDifference > 0 ? "PJ" : "CLT";

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
      <h2 className="text-2xl font-bold">Comparação</h2>

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] ">Vencedor</TableHead>
            <TableHead className="text-right w-[250px]">
              Diferença Mensal
            </TableHead>
            <TableHead className="text-right w-[250px]">
              Diferença Anual
            </TableHead>
            <TableHead className="text-right w-[250px] ">
              Aumento Relativo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold ">{betterOption}</TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(Math.abs(monthlyDifference))}
            </TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(Math.abs(yearlyDifference))}
            </TableCell>
            <TableCell className="text-right w-[250px] ">
              {relativeIncrease.toFixed(1)}%
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <ComparisonCard
        results={results}
        defaultInterestRate={defaultInterestRate}
      />
    </div>
  );
}
