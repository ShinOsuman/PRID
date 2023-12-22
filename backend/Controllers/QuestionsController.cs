using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;
using Microsoft.AspNetCore.Authorization;

namespace prid.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class QuestionsController : ControllerBase
{
    private readonly Context _context;
    private readonly IMapper _mapper;

    public QuestionsController(Context context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionDto>> GetOne(int id) {
        //récupération de l'utilisateur
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        //récupération de la question
        var question = await _context.Questions.Include(q => q.Solutions)
                                                .Include(q => q.Quiz)
                                                .ThenInclude(q => q.Database).SingleOrDefaultAsync(q => q.Id == id);
        if (question == null){
            return NotFound();
        }
        //récupération de la réponse de l'utilisateur
        var attempt = await _context.Attempts.Where(a => a.QuizId == question.QuizId && a.StudentId == user.Id).OrderBy(a => a.Id).LastOrDefaultAsync();
        if(attempt != null){
            var answer = await _context.Answers.Where(a => a.AttemptId == attempt.Id && a.QuestionId == question.Id).SingleOrDefaultAsync();
            if(answer == null){
                question.AnswerStatus = "(pas encore répondu)";
            }else {
                question.Answer = answer.Sql;
            }
        }
        //récupération de la question précédente
        var previousQuestion = await _context.Questions.Where(q => q.QuizId == question.QuizId && q.Order == question.Order - 1).SingleOrDefaultAsync();
        if(previousQuestion != null){
            question.PreviousQuestion = previousQuestion.Id;
        }
        //récupération de la question suivante
        var nextQuestion = await _context.Questions.Where(q => q.QuizId == question.QuizId && q.Order == question.Order + 1).SingleOrDefaultAsync();
        if(nextQuestion != null){
            question.NextQuestion = nextQuestion.Id;
        }

        return _mapper.Map<QuestionDto>(question);
    }
    [HttpPost("evaluate")]
    public async Task<ActionResult<Query>> Evaluate(EvalDto answer) {
        var question = await _context.Questions.Include(q => q.Solutions).Include(q => q.Quiz).ThenInclude(q => q.Database).Where(q => q.Id == answer.QuestionId).SingleOrDefaultAsync();
        //récupération de la question
        if(question == null){
            return BadRequest();
        }
        //récupération de la db
        var db = await _context.Databases.Where(d => d.Id==question.Quiz.DatabaseId).SingleOrDefaultAsync();
        if(db == null){
            return BadRequest();
        }
        //création de la query
        Query query = new Query(answer.Sql, db.Name);
        query.Solutions = _mapper.Map<ICollection<SolutionDto>>(question.Solutions);
        query.GetCompare(db.Name);
        return query;
    }
    
}