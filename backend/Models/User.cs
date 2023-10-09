using System.ComponentModel.DataAnnotations;

namespace prid.Models;

public class User
{
    [Key]
    public int Id { get; set;}
    public string Pseudo { get; set; } = "";
    public string Password { get; set; } = "";
    public string Email { get; set; } = null!;
    public string? LastName { get; set; }
    public string? FirstName { get; set; }
    public DateTimeOffset? BirthDate { get; set; }

    public int? Age {
        get {
            if (!BirthDate.HasValue){
                return null;
            }
            var today = DateTime.Today;
            var age = today.Year - BirthDate.Value.Year;
            if (BirthDate.Value.Date > today.AddYears(-age)){
                age--;
            }
            return age;
        }
    }
}
