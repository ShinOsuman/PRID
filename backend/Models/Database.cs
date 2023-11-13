using System.ComponentModel.DataAnnotations;

namespace prid.Models;

public class Database {
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }

    public ICollection<Quizz> Quizzes { get; set; } = new HashSet<Quizz>();
}