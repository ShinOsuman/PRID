using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid.Models;

public class Question {
    [Key]
    public int Id { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = "";
    public Quiz Quiz { get; set; } = null!;
    public int QuizId { get; set; }
    public ICollection<Solution> Solutions { get; set; } = new HashSet<Solution>();
    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
    [NotMapped]
    public string QuizName { 
        get {
            return Quiz.Name;
        }
    }
    [NotMapped]
    public string AnswerStatus { get; set; } = "";
    [NotMapped]
    public string Answer { get; set; } = "";
    [NotMapped]
    public int PreviousQuestion { get; set; } = 0;
    [NotMapped]
    public int NextQuestion { get; set; } = 0;
}

public class QuestionDto {
    public int Id { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = "";
    public int QuizId { get; set; }
    public string QuizName { get; set; } = "";
    public QuizDTO Quiz { get; set; } = null!;
    public string AnswerStatus { get; set; } = "";
    public string Answer { get; set; } = "";
    public int PreviousQuestion { get; set; } = 0;
    public int NextQuestion { get; set; } = 0;
}