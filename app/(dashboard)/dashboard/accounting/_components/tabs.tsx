import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type ChartOfAccount = {
  id: string;
  name: string;
  code: string;
  normalBalance: "debit" | "credit";
  categoryId: string;
};

interface CoaTabsProps {
  coas: ChartOfAccount[];
  columns: any[];
  loading: boolean;
}

const coaGroups = [
  { label: "Assets", range: [1000, 1999] },
  { label: "Liabilities", range: [2000, 2999] },
  { label: "Equity", range: [3000, 3999] },
  { label: "Revenue", range: [4000, 4999] },
  { label: "Expenses", range: [5000, 5999] },
];

export default function CoaTabs({ coas, columns, loading }: CoaTabsProps) {
  // 1. Group your COAs by code range
  const grouped =
    coaGroups.map(({ label, range }) => {
      const [min, max] = range;
      const data = coas?.filter((a) => {
        const num = parseInt(a.code, 10);
        return !isNaN(num) && num >= min && num <= max;
      });
      return { label, data };
    }) ?? [];

  // 2. Pick the first group as the default active tab
  const defaultTab = grouped[0]?.label;

  return (
    <Tabs defaultValue={defaultTab}>
      {/* Tab buttons */}
      <TabsList>
        {grouped.map((g) => (
          <TabsTrigger key={g.label} value={g.label}>
            {g.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab panels */}
      {grouped.map((g) => (
        <TabsContent key={g.label} value={g.label} className="pt-6">
          <TableWrapper<ChartOfAccount>
            columns={columns}
            data={g.data}
            loading={loading}
            title={`${g.label} Accounts`}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
