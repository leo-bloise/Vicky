import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MonthReport } from './MonthReport';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  counterparty: string;
}

interface ChartData {
  date: string;
  count: number;
}

export function MonthReportContainer() {
  const { state: { user } } = useAuth();
  const [incoming, setIncoming] = useState(0);
  const [outgoing, setOutgoing] = useState(0);
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    loadMonthData();
  }, [user]);

  const loadMonthData = () => {
    const all = JSON.parse(localStorage.getItem('vickyTransactions') || '[]');
    const userTransactions: Transaction[] = all.filter((t: Transaction) => t.userId === user?.username);

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for current month
    const monthTransactions = userTransactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Calculate incoming and outgoing
    let totalIncoming = 0;
    let totalOutgoing = 0;

    monthTransactions.forEach((t) => {
      if (t.amount > 0) {
        totalIncoming += t.amount;
      } else {
        totalOutgoing += Math.abs(t.amount);
      }
    });

    setIncoming(totalIncoming);
    setOutgoing(totalOutgoing);
    setBalance(totalIncoming - totalOutgoing);

    // Prepare chart data - count transactions per day
    const transactionsByDate: { [key: string]: number } = {};

    monthTransactions.forEach((t) => {
      const dateKey = t.date;
      transactionsByDate[dateKey] = (transactionsByDate[dateKey] || 0) + 1;
    });

    // Convert to array and sort by date
    const chartArray: ChartData[] = Object.entries(transactionsByDate).map(([date, count]) => ({
      date,
      count,
    }));

    chartArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Format dates for display
    const formattedChartData = chartArray.map((item) => ({
      date: new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      count: item.count,
    }));

    setChartData(formattedChartData);
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

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <MonthReport
      incoming={incoming}
      outgoing={outgoing}
      balance={balance}
      chartData={chartData}
      currentMonth={currentMonth}
      formatCurrency={formatCurrency}
      getBalanceColor={getBalanceColor}
      getBalanceBackground={getBalanceBackground}
    />
  );
}