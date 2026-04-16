import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

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

export function MonthReport() {
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
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: item.count,
    }));

    setChartData(formattedChartData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
    <div>
      <div className="mb-6">
        <h2 className="text-3xl text-gray-900">Month Report</h2>
        <p className="text-gray-500 mt-1">{currentMonth}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Incoming */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Incoming</div>
          <div className="text-2xl text-green-600">{formatCurrency(incoming)}</div>
        </div>

        {/* Outgoing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Outgoing</div>
          <div className="text-2xl text-red-600">{formatCurrency(outgoing)}</div>
        </div>

        {/* Balance */}
        <div className={`rounded-lg shadow-sm border p-6 ${getBalanceBackground()}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              balance < 0 ? 'bg-red-200' : balance === 0 ? 'bg-yellow-200' : 'bg-green-200'
            }`}>
              <Wallet className={`w-6 h-6 ${
                balance < 0 ? 'text-red-700' : balance === 0 ? 'text-yellow-700' : 'text-green-700'
              }`} />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Balance</div>
          <div className={`text-2xl ${getBalanceColor()}`}>{formatCurrency(balance)}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl text-gray-900 mb-6">Transactions by Date</h3>
        {chartData.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No transaction data available for this month
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
