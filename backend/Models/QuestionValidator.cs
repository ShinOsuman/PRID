using FluentValidation;
using Microsoft.EntityFrameworkCore;
using prid.Helpers;
using System.Data;
using System.Text.RegularExpressions;

namespace prid.Models;

public class QuestionValidator : AbstractValidator<Question>{

    private readonly Context _context;
    
    public QuestionValidator(Context context) {
        _context = context;

        CreateRules();
    }

    private void CreateRules(){
        RuleFor(q => q.Body)
            .NotEmpty()
            .MinimumLength(2);

        RuleFor(q => q.Order)
            .NotEmpty()
            .GreaterThan(0);

        RuleFor(q => new {q.Id, q.Order, q.QuizId})
            .MustAsync((q, token) => BeUniqueOrder(q.Id, q.Order, q.QuizId, token))
            .OverridePropertyName(nameof(Question.Order))
            .WithMessage("{PropertyName} must be unique in a quiz");

        RuleFor(q => q.Solutions)
            .NotEmpty()
            .WithMessage("Question must have at least one solution");
            
    }

    private async Task<bool> BeUniqueOrder(int id, int order, int quizId, CancellationToken token) {
        return !await _context.Questions.AnyAsync(q => q.Order == order 
                                                && q.Id != id
                                                && q.QuizId == quizId, 
                                                cancellationToken: token);
    }
}
