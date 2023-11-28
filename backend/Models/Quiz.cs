using System.ComponentModel.DataAnnotations;

namespace prid.Models;

public class Quiz {
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsClosed { get; set; } = true;
    public bool IsTest { get; set; } = false;
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public Database Database { get; set; } = null!;
    public int DatabaseId { get; set; }
    public ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    public ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();

}


public class QuizDTO{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsClosed { get; set; } = true;
    public bool IsTest { get; set; } = false;
        
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }

}

public class TrainingWithDatabaseDto : QuizDTO {
    public DatabaseDto Database { get; set; } = null!;
}