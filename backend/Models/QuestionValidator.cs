using FluentValidation;
using Microsoft.EntityFrameworkCore;
using prid.Helpers;
using System.Data;
using System.Text.RegularExpressions;

namespace prid.Models;

public class QuestionValidator : AbstractValidator<Question>{

    private readonly Context _context;
    private ICollection<Question> _questions;
    
    public QuestionValidator(Context context, ICollection<Question> questions) {
        _context = context;
        _questions = questions;

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
            .Must((q) => BeUniqueOrder(q.Id, q.Order, q.QuizId))
            .OverridePropertyName(nameof(Question.Order))
            .WithMessage("{PropertyName} must be unique in a quiz");

        RuleFor(q => q.Solutions)
            .NotEmpty()
            .WithMessage("Question must have at least one solution");
            
    }

    private bool BeUniqueOrder(int id, int order, int quizId) {
        foreach(var q in _questions) {
            if(q.Order == order && q.Id != id && q.QuizId == quizId) {
                return false;
            }
        }
        return true;
    }
}
