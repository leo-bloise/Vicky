using CsvHelper.Configuration.Attributes;

namespace Vicky.AccountStatement.AccountStatements.Nubank;

public class NubankStatementRecord
{
    [Name("Data")]
    [Format("dd/MM/yyyy")]
    public DateTime Data { get; set; }

    [Name("Valor")]
    public decimal Valor { get; set; }

    [Name("Identificador")]
    public string Identificador { get; set; } = string.Empty;

    [Name("Descrição")]
    public string Descricao { get; set; } = string.Empty;
}