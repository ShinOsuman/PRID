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