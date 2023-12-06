using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;
using Microsoft.AspNetCore.Authorization;

namespace prid.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class QuizzesController : ControllerBase
{
    private readonly Context _context;
    private readonly IMapper _mapper;

    public QuizzesController(Context context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("trainingQuizzes")]
    public async Task<ActionResult<IEnumerable<TrainingWithDatabaseDto>>> GetTrainings() {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        // Récupère une liste de tous les quiz d'entraînement
        var quizzes = await _context.Quizzes
                                    .Where(q => !q.IsTest)
                                    .Include(q => q.Database)
                                    .Include(q => q.Attempts)
                                    .Include(q => q.Questions)
                                    .ToListAsync();
        foreach(var q in quizzes){
            q.Status = q.GetStatus(user);
        }
        return _mapper.Map<List<TrainingWithDatabaseDto>>(quizzes);
    }

    [HttpGet("testQuizzes")]
    public async Task<ActionResult<IEnumerable<TrainingWithDatabaseDto>>> GetTests() {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        // Récupère une liste de tous les quiz de tests
        var quizzes = await _context.Quizzes
                                    .Where(q => q.IsTest)
                                    .Include(q => q.Database)
                                    .Include(q => q.Attempts)
                                    .Include(q => q.Questions)
                                    .ToListAsync();
        foreach(var q in quizzes){
            q.Status = q.GetTestStatus(user);
            var attempt = await _context.Attempts.SingleOrDefaultAsync(a => a.QuizId == q.Id && a.StudentId == user.Id);
            if(attempt != null){
                int CorrectAnswers = _context.Answers.Where(a => a.AttemptId == attempt.Id && a.IsCorrect).Count();
                int QuestionsCount = _context.Questions.Where(question => question.QuizId == q.Id).Count();
                q.Evaluation = CorrectAnswers.ToString() + "/" + QuestionsCount.ToString();
            }
            
        }
        return _mapper.Map<List<TrainingWithDatabaseDto>>(quizzes);
    }


}
