using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid.Models;

public class Quiz
{
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
    [NotMapped]
    public string Status { get; set;}= "";

    public string GetStatus(User user)
    {
        string res = Attempts.Any(q => q.StudentId == user.Id) ? "EN_COURS" : "PAS_COMMENCE";
        if(EndDate.HasValue){
            res = "FINI";
        }
        return res;
    }

}


public class QuizDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsClosed { get; set; } = true;
    public bool IsTest { get; set; } = false;

    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public ICollection<AttemptDto> Attempts { get; set; } = new HashSet<AttemptDto>();
    public string Status { get; set ; } = "";


}

public class TrainingWithDatabaseDto : QuizDTO
{
    public DatabaseDto Database { get; set; } = null!;
    
}