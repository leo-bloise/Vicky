import { useState, useEffect } from 'react';
import { useAuth, useReportClient } from '../contexts/AuthContext';
import { MonthReport } from './MonthReport';
import { formatDate } from '../utils/formatDate';

interface ChartData {
  date: string;
  count: number;
}

export function MonthReportContainer() {
  const { state: { user } } = useAuth();
  const reportClient = useReportClient();
  const [incoming, setIncoming] = useState(0);
  const [outgoing, setOutgoing] = useState(0);
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMonthData();
    }
  }, [user]);

  const loadMonthData = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
      const currentYear = now.getFullYear();

      const response = await reportClient.calculate({
        month: currentMonth,
        year: currentYear
      });

      if (response.success && response.data) {
        const report = response.data;
        setIncoming(report.incoming);
        setOutgoing(Math.abs(report.outgoing));
        setBalance(report.balance);
        // Prepare chart data from transactionsByDate
        const chartArray: ChartData[] = Object.entries(report.transactionsByDate).map(([date, transactions]) => ({
          date,
          count: transactions.length,
        }));

        chartArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Format dates for display
        const formattedChartData = chartArray.map((item) => ({
          date: formatDate(item.date),
          count: item.count,
        }));

        setChartData(formattedChartData);
      }
    } catch (error) {
      console.error("Failed to load report data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const getBalanceColor = () => {
    if (balance < 0) return 'text-red-600';
    if (balance === 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBalanceBackground = () => {
    if (balance < 0) return 'bg-red-50 border-red-200';
    if (balance === 0) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading report...</div>;
  }

  return (
    <MonthReport
      incoming={incoming}
      outgoing={outgoing}
      balance={balance}
      chartData={chartData}
      currentMonth={currentMonthName}
      formatCurrency={formatCurrency}
      getBalanceColor={getBalanceColor}
      getBalanceBackground={getBalanceBackground}
    />
  );
}
