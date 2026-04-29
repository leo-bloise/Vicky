using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration.Attributes;

namespace Vicky.Ledger;

public enum AccountStatementProvider
{
    Nubank,
    Itau,
    C6
}

public interface IAccountStatement
{
    DateTime TransactionDate { get; }
    decimal Amount { get; }
    string Identifier { get; }
    string Description { get; }
}

public interface IAccountStatementParser
{
    IEnumerable<IAccountStatement> Parse(Stream stream);
}

public class NubankAccountStatement : IAccountStatement
{
    public DateTime TransactionDate { get; init; }
    public decimal Amount { get; init; }
    public string Identifier { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}

public class NubankStatementRecord
{
    [Name("Data")]
    public DateTime Data { get; set; }

    [Name("Valor")]
    public decimal Valor { get; set; }

    [Name("Identificador")]
    public string Identificador { get; set; } = string.Empty;

    [Name("Descrição")]
    public string Descricao { get; set; } = string.Empty;
}

public class NubankAccountStatementParser : IAccountStatementParser
{
    public IEnumerable<IAccountStatement> Parse(Stream stream)
    {
        using var reader = new StreamReader(stream);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        
        var records = csv.GetRecords<NubankStatementRecord>();
        foreach (var record in records)
        {
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
