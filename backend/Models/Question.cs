using System.ComponentModel.DataAnnotations;

namespace prid.Models;

public class Question {
    [Key]
    public int Id { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = "";
    public Quizz Quizz { get; set; } = null!;
    public int QuizzId { get; set; }
    public ICollection<Solution> Solutions { get; set; } = new HashSet<Solution>();
    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();

}