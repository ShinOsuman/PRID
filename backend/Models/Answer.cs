using System.ComponentModel.DataAnnotations;

namespace prid.Models;

public class Answer {
    [Key]
    public int Id { get; set; }
    public string Sql { get; set; } = "";
    public DateTimeOffset Timestamp { get; set; }
    public bool IsCorrect { get; set; } = false;
    public Question Question { get; set; } = null!;
    public int QuestionId { get; set; }
    public Attempt Attempt { get; set; } = null!;
    public int AttemptId { get; set; }
}

public class AnswerDto {
    public int Id { get; set; }
    public string Sql { get; set; } = "";
    public DateTimeOffset Timestamp { get; set; }
    public bool IsCorrect { get; set; } = false;
    public int QuestionId { get; set; }
    public int AttemptId { get; set; }
    
}

public class EvalDto {
    public string Sql { get; set; } = "";
    public int QuestionId { get; set; }
    public bool isDisplay { get; set; } = false;

}