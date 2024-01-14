namespace prid.Models;

public class Teacher : User {
    public Role Role { get; set; } = Role.Teacher;
}