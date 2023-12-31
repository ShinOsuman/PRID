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
    public bool IsClosed { get; set; } = false;
    public bool IsTest { get; set; } = false;
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public Database Database { get; set; } = null!;
    public int DatabaseId { get; set; }
    public ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    public ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
    [NotMapped]
    public string Status { get; set;}= "";
    [NotMapped]
    public string Evaluation { get; set; } = "N/A";
    [NotMapped]
    public int FirstQuestionId { 
        get{
            return Questions.Where(q => q.QuizId == this.Id)
                            .OrderBy(q => q.Order)
                            .Select(q => q.Id)
                            .FirstOrDefault();
        } 
     }

    public string GetStatus(User user)
    {
        string res = Attempts.Any(q => q.StudentId == user.Id) ? "EN_COURS" : "PAS_COMMENCE";
        var StudentAttempts = Attempts.Where(a => a.StudentId == user.Id).OrderBy(a => a.Id).LastOrDefault();
        if(StudentAttempts != null && StudentAttempts.Finish.HasValue){
            res = "FINI";
        }
        return res;
    }

    public string GetTestStatus(User user)
    {
        string res = Attempts.Any(q => q.StudentId == user.Id) ? "FINI" : "PAS_COMMENCE";
        if(EndDate!.Value <= DateTimeOffset.Now){
            res = "CLOTURE";
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
    public string Evaluation { get; set; } = "N/A";
    public int FirstQuestionId { get; set; }
    public DatabaseDto Database { get; set; } = null!;
}

public class QuizWithIdDto {
    public int Id { get; set; }
}