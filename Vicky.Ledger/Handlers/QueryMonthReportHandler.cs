using Vicky.Common;
using Vicky.Ledger.Queries;

namespace Vicky.Ledger.Handlers;

public class QueryMonthReportHandler(ITransactionRepository transactionRepository): IQueryHandler<GetMonthReport, Report>
{
    private Tuple<DateTime, DateTime> CalculateMonthRange(int year, int month)
    {
        DateTime start = new(year, month, 1);
        DateTime end = start.AddMonths(1).AddDays(-1);

        return new Tuple<DateTime, DateTime>(start, end);
    }

    public Report Execute(GetMonthReport request)
    {
        Report report = new Report();

        Tuple<DateTime, DateTime> range = CalculateMonthRange(request.Year, request.Month);

        IEnumerable<Transaction> transactions = transactionRepository.GetTransactionsByRangeDate(range.Item1, range.Item2, request.UserId);

        foreach(Transaction transaction in transactions)
        {
            report.Incorporate(transaction);
        }

        return report;
    }
}