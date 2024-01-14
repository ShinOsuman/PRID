namespace prid.Models;

public class Student : User {
        public Role Role { get; set; } = Role.Student;

    public ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
}