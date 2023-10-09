namespace prid.Models;

public class UserDTO
{
    public int Id { get; set; }
    public string Pseudo { get; set; } = "";
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set;} = null!;
    public DateTimeOffset? BirthDate { get; set; }
}

public class UserWithPasswordDTO : UserDTO {
    public string Password { get; set; } = "";
}
