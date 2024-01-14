using FluentValidation;
using Microsoft.EntityFrameworkCore;
using prid.Helpers;
using System.Data;
using System.Text.RegularExpressions;

namespace prid.Models;

public class SolutionValidator : AbstractValidator<Solution>{

    private readonly Context _context;
    private ICollection<Solution> _solutions;
    
    public SolutionValidator(Context context, ICollection<Solution> solutions) {
        _context = context;
        _solutions = solutions;

        CreateRules();
    }

    private void CreateRules(){
        RuleFor(s => s.Sql)
            .NotEmpty();

        RuleFor(s => s.Order)
            .NotEmpty()
            .GreaterThan(0);

        RuleFor(s => new {s.Id, s.Order, s.QuestionId})
            .Must((s) => BeUniqueOrder(s.Id, s.Order, s.QuestionId))
            .OverridePropertyName(nameof(Solution.Order))
            .WithMessage("{PropertyName} must be unique in a question");
            
    }

    private bool BeUniqueOrder(int id, int order, int questionId) {
        foreach(var s in _solutions) {
            if(s.Order == order && s.Id != id && s.QuestionId == questionId) {
                return false;
            }
        }
        return true;
    }
}
