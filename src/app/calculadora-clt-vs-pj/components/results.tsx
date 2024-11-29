import { ComparisonCard } from "@/app/calculadora-clt-vs-pj/components/comparison-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  findCLTEquivalentForPJ,
  findPJEquivalentForCLT,
} from "@/lib/salary-calculations";
import { formatCurrency } from "@/lib/utils";
import { CalculationResults, FormData } from "../types";

interface ResultsProps {
  results: CalculationResults;
  defaultInterestRate: number;
  formData: FormData;
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
            <TableHead className="w-[100px] px-0">Regime</TableHead>
            <TableHead className="text-right w-[250px]">
              Salário Líquido Mensal
            </TableHead>
            <TableHead className="text-right w-[250px]">
              Salário Líquido Anual
            </TableHead>
            <TableHead className="text-right w-[250px] px-0">
              Equivalente
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="px-0">CLT</TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(results.clt.total)}
            </TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(results.clt.total * 12)}
            </TableCell>
            <TableCell className="text-right w-[250px] px-0">
              Valor PJ: {formatCurrency(cltToPJEquivalent)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="px-0">PJ</TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(results.pj.total)}
            </TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(results.pj.total * 12)}
            </TableCell>
            <TableCell className="text-right w-[250px] px-0">
              Valor CLT: {formatCurrency(pjToCLTEquivalent)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] px-0">Vencedor</TableHead>
            <TableHead className="text-right w-[250px]">
              Diferença Mensal
            </TableHead>
            <TableHead className="text-right w-[250px]">
              Diferença Anual
            </TableHead>
            <TableHead className="text-right w-[250px] px-0">
              Aumento Relativo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold px-0">{betterOption}</TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(Math.abs(monthlyDifference))}
            </TableCell>
            <TableCell className="text-right w-[250px]">
              {formatCurrency(Math.abs(yearlyDifference))}
            </TableCell>
            <TableCell className="text-right w-[250px] px-0">
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
