using System.ComponentModel.DataAnnotations;

namespace prid.Models;

public class Solution {
    [Key]
    public int Id { get; set; }
    public int Order { get; set; }
    public string Sql { get; set; } = "";
    public Question Question { get; set; } = null!;
    public int QuestionId { get; set; }
}

public class SolutionDto {
    public int Id { get; set; }
    public int Order { get; set; }
    public string Sql { get; set; } = "";
    public int QuestionId { get; set; }
}   