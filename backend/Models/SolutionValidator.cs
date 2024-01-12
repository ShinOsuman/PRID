using FluentValidation;
using Microsoft.EntityFrameworkCore;
using prid.Helpers;
using System.Data;
using System.Text.RegularExpressions;

namespace prid.Models;

public class SolutionValidator : AbstractValidator<Solution>{

    private readonly Context _context;
    
    public SolutionValidator(Context context) {
        _context = context;

        CreateRules();
    }

    private void CreateRules(){
        RuleFor(s => s.Sql)
            .NotEmpty();

        RuleFor(s => s.Order)
            .NotEmpty()
            .GreaterThan(0);

        RuleFor(s => new {s.Id, s.Order, s.QuestionId})
            .MustAsync((s, token) => BeUniqueOrder(s.Id, s.Order, s.QuestionId, token))
            .OverridePropertyName(nameof(Solution.Order))
            .WithMessage("{PropertyName} must be unique in a question");
            
    }

    private async Task<bool> BeUniqueOrder(int id, int order, int questionId, CancellationToken token) {
        return !await _context.Solutions.AnyAsync(s => s.Order == order 
                                                && s.Id != id
                                                && s.QuestionId == questionId, 
                                                cancellationToken: token);
    }
}
