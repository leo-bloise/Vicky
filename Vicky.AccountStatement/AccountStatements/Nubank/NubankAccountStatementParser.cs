using System.Globalization;
using CsvHelper;

namespace Vicky.AccountStatement.AccountStatements.Nubank;

public class NubankAccountStatementParser : IAccountStatementParser
{
    public IEnumerable<IAccountStatement> Parse(Stream stream)
    {
        using StreamReader reader = new(stream);
        using CsvReader csv = new(reader, CultureInfo.InvariantCulture);

        IEnumerable<NubankStatementRecord?> records = csv.GetRecords<NubankStatementRecord>();

        foreach (var record in records)
        {
            if(record is null) continue;

            yield return new NubankAccountStatement
            {
                TransactionDate = record.Data,
                Amount = record.Valor,
                Identifier = record.Identificador,
                Description = record.Descricao
            };
        }
    }
}