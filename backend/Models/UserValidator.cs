using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text.RegularExpressions;

namespace prid.Models;

public class UserValidator : AbstractValidator<User>
{
    private readonly Context _context;

    public UserValidator(Context context) {
        _context = context;

        CreateRules();
    }

    private void CreateRules(){
        RuleFor(u => u.Pseudo)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(10)
            .Matches(@"^[a-z][a-z0-9_]+$", RegexOptions.IgnoreCase);
        
        RuleFor(u => u.Password)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(10);

        RuleFor(u => u.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(u => u.LastName)
            .MinimumLength(3)
            .MaximumLength(50)
            .Matches(@"^\S.*\S$");

        RuleFor(u => u.FirstName)
            .MinimumLength(3)
            .MaximumLength(50)
            .Matches(@"^\S.*\S$");

        RuleFor(u => new {u.LastName, u.FirstName})
            .Must(u => String.IsNullOrEmpty(u.LastName) && String.IsNullOrEmpty(u.FirstName) ||
                    !String.IsNullOrEmpty(u.LastName) && !String.IsNullOrEmpty(u.FirstName))
            .WithMessage("'Last Name' and 'First Name' must both be empty or both be not empty");
        
        RuleFor(u => new {u.Id, u.Pseudo})
            .MustAsync((u, token) => BeUniquePseudo(u.Id, u.Pseudo, token))
            .OverridePropertyName(nameof(User.Pseudo))
            .WithMessage("'{PropertyName}' must be unique");

        RuleFor(u => new {u.Id, u.Email})
            .MustAsync((u, token) => BeUniqueEmail(u.Id, u.Email, token))
            .OverridePropertyName(nameof(User.Email))
            .WithMessage("'{PropertyName}' must be unique");

        RuleFor(u => new {u.Id, u.LastName, u.FirstName})
            .MustAsync((u, token) => BeUniqueFullName(u.Id, u.LastName, u.FirstName, token))
            .WithMessage("The combination of 'Last Name' and 'Full Name' must be unique");

        RuleFor(u => u.BirthDate)
            .LessThan(DateTime.Today)
            .DependentRules(() => {
                RuleFor(u => u.Age)
                    .GreaterThanOrEqualTo(18)
                    .LessThanOrEqualTo(125);
            });
    }

    private async Task<bool> BeUniquePseudo(int id, string pseudo, CancellationToken token){
        return !await _context.Users.AnyAsync(u => u.Id != id && 
                                                u.Pseudo == pseudo, 
                                                cancellationToken: token);
    }

    private async Task<bool> BeUniqueEmail(int id, string email, CancellationToken token){
        return !await _context.Users.AnyAsync(u => u.Id != id &&
                                                u.Email == email,
                                                cancellationToken: token);
    }

    private async Task<bool> BeUniqueFullName(int id, string? lastName, string? firstName, CancellationToken token){
        if (lastName == null && firstName == null){
            return true;
        }
        return !await _context.Users.AnyAsync(u => u.Id != id &&
                                                u.LastName == lastName &&
                                                u.FirstName == firstName,
                                                cancellationToken: token);
    }
}
