using MySql.Data.MySqlClient;
using Mysqlx;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace prid.Models;

public class Query {
    public ICollection<String> Comments {get; set;} = new HashSet<String>();
    public int Lignes {get; set;} = 0;
    public string[] Columns { get; set; } = new string[0];
    public string[] SolutionColumns { get; set; } = new string[0];
    public int RowCount { get; set; } = 0;
    public int SolutionRowCount { get; set; } = 0;


    public string[][] Data { get; set; } = new string[0][];
    public string[][] SolutionData { get; set; } = new string[0][];
    public ICollection<SolutionDto> Solutions { get; set; } = new HashSet<SolutionDto>();
    public ICollection<String> BadResults { get; set; } = new HashSet<String>();
    public Boolean IsCorrect {
        get {
            return SolutionRowCount == RowCount && SolutionColumns.Length == Columns.Length;
        }
    }
    


    public Query(string query, string databaseName) {
        evaluateQuery(query, databaseName);
    }

    private void evaluateQuery(string query, string databaseName){
        using MySqlConnection connection = new($"server=localhost;database=" + databaseName + ";uid=root;password=root");
        DataTable table;
        try {
            connection.Open();
            MySqlCommand command = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + query, connection);
            MySqlDataAdapter adapter = new MySqlDataAdapter(command);
            table = new DataTable();
            adapter.Fill(table);
            // Récupère les noms des colonnes dans un tableau de strings
            RowCount = table.Rows.Count;
            Columns = new string[table.Columns.Count];
            for (int i = 0; i < table.Columns.Count; ++i)
                Columns[i] = table.Columns[i].ColumnName;

            // Récupère les données dans un tableau de strings à deux dimensions
            Data = new string[table.Rows.Count][];
            for (int j = 0; j < table.Rows.Count; ++j) {
                Data[j] = new string[table.Columns.Count];
                for (int i = 0; i < table.Columns.Count; ++i) {
                    object value = table.Rows[j][i];
                    string str;
                    if (value == null)
                        str = "NULL";
                    else {
                        if (value is DateTime d) {
                            if (d.TimeOfDay == TimeSpan.Zero)
                                str = d.ToString("yyyy-MM-dd");
                            else
                                str = d.ToString("yyyy-MM-dd hh:mm:ss");
                        } else
                            str = value?.ToString() ?? "";
                    }
                    Data[j][i] = str;
                }
            }
        } catch (Exception e) {
            Comments.Add(e.Message);
        } finally{
            connection.Close();
        }
    }

    private void EvaluateSolution(string query, string databaseName){
        if(query == ""){
            return;
        }
        using MySqlConnection connection = new($"server=localhost;database=" + databaseName + ";uid=root;password=root");
        DataTable table;
        try {
            connection.Open();
            MySqlCommand command = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + query, connection);
            MySqlDataAdapter adapter = new MySqlDataAdapter(command);
            table = new DataTable();
            adapter.Fill(table);
            // Récupère les noms des colonnes dans un tableau de strings
            SolutionRowCount = table.Rows.Count;
            SolutionColumns = new string[table.Columns.Count];
            for (int i = 0; i < table.Columns.Count; ++i)
                SolutionColumns[i] = table.Columns[i].ColumnName;

            // Récupère les données dans un tableau de strings à deux dimensions
            SolutionData = new string[table.Rows.Count][];
            for (int j = 0; j < table.Rows.Count; ++j) {
                SolutionData[j] = new string[table.Columns.Count];
                for (int i = 0; i < table.Columns.Count; ++i) {
                    object value = table.Rows[j][i];
                    string str;
                    if (value == null)
                        str = "NULL";
                    else {
                        if (value is DateTime d) {
                            if (d.TimeOfDay == TimeSpan.Zero)
                                str = d.ToString("yyyy-MM-dd");
                            else
                                str = d.ToString("yyyy-MM-dd hh:mm:ss");
                        } else
                            str = value?.ToString() ?? "";
                    }
                    SolutionData[j][i] = str;
                }
            }
        } catch (Exception e) {
            Comments.Add(e.Message);
        }
    }

    public void GetCompare(string databaseName){
        if(Comments.Count == 0 ){
            EvaluateSolution(Solutions.FirstOrDefault()?.Sql ?? "", databaseName);
            if(SolutionRowCount != RowCount){
                BadResults.Add("nombre de lignes incorrect");
            }
            if(SolutionColumns.Length != Columns.Length){
                BadResults.Add("nombre de colonnes incorrect");
            }
        }
    }

}