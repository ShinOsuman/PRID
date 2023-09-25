using System.ComponentModel.DataAnnotations;

namespace prid.Models;

public class User
{
    [Key]
    public int Id { get; set;}
    [MinLength(3), MaxLength(10)]
    public string Pseudo { get; set; } = "";
    [MinLength(3), MaxLength(10)]
    public string Password { get; set; } = "";
    [Required]
    public string Email { get; set; } = null!;
    [MinLength(3), MaxLength(50)]
    public string? LastName { get; set; }
    [MinLength(3), MaxLength(50)]
    public string? FullName { get; set; }
    public DateTime? BirthDate { get; set; }
}
