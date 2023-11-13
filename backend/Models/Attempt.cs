namespace prid.Models;

public class Attempt {
    public int Id { get; set; }
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; }
    public Quizz Quizz { get; set; } = null!;
    public int QuizzId { get; set; }
    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
    public Student Student { get; set; } = null!;
    public int StudentId { get; set; }

}