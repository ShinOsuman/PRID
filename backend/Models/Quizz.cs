using System.ComponentModel.DataAnnotations;

namespace prid.Models;

public class Quizz {
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsClosed { get; set; } = true;
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; }
    public Database Database { get; set; } = null!;
    public int DatabaseId { get; set; }
    public ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    public ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();




}