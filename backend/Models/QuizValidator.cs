using FluentValidation;
using Microsoft.EntityFrameworkCore;
using prid.Helpers;
using System.Data;
using System.Text.RegularExpressions;

namespace prid.Models;

public class QuizValidator : AbstractValidator<Quiz>
{
    private readonly Context _context;

    public QuizValidator(Context context) {
        _context = context;

        CreateRules();
    }

    private void CreateRules(){
        RuleFor(q => q.Name)
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(q => new {q.Id, q.Name})
            .MustAsync((q, token) => BeUniqueName(q.Id, q.Name, token))
            .OverridePropertyName(nameof(Quiz.Name))
            .WithMessage("Quiz name must be unique");
        
        RuleFor(q => q.Database)    
            .NotNull()
            .WithMessage("Quiz must be linked to a database");
        
        RuleFor(q => q.Questions)
            .NotEmpty()
            .WithMessage("Quiz must have at least one question");
        
        
        
    }

    private async Task<bool> BeUniqueName(int id, string name, CancellationToken token) {
        return !await _context.Quizzes.AnyAsync(q => q.Name == name 
                                                && q.Id != id, 
                                                cancellationToken: token);
    }
}