using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;
using Microsoft.AspNetCore.Authorization;
using prid.Helpers;

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

    [Authorized(Role.Teacher)]
    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<QuizDTO>>> GetAll() {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        // Récupère une liste de tous les quiz
        var quizzes = await _context.Quizzes
                                    .Include(q => q.Database)
                                    .Include(q => q.Attempts)
                                    .Include(q => q.Questions)
                                    .ToListAsync();
        foreach(var q in quizzes){
            q.Status = "teacher";
        }
        return _mapper.Map<List<QuizDTO>>(quizzes);
    }

    [HttpGet("trainingQuizzes")]
    public async Task<ActionResult<IEnumerable<QuizDTO>>> GetTrainings() {
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
        return _mapper.Map<List<QuizDTO>>(quizzes);
    }

    [HttpGet("testQuizzes")]
    public async Task<ActionResult<IEnumerable<QuizDTO>>> GetTests() {
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
            var attempt = await _context.Attempts.Where(a => a.QuizId == q.Id && a.StudentId == user.Id).OrderBy(a => a.Id).LastOrDefaultAsync();
            if(attempt != null){
                int CorrectAnswers = _context.Answers.Where(a => a.AttemptId == attempt.Id && a.IsCorrect).Count();
                int QuestionsCount = _context.Questions.Where(question => question.QuizId == q.Id).Count();
                q.Evaluation = CorrectAnswers.ToString() + "/" + QuestionsCount.ToString();
            }
            
        }
        return _mapper.Map<List<QuizDTO>>(quizzes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuizDTO>> GetQuiz(int id) {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        // Récupère un quiz par son id
        var quiz = await _context.Quizzes
                                    .Include(q => q.Database)
                                    .Include(q => q.Attempts)
                                    .Include(q => q.Questions)
                                    .SingleOrDefaultAsync(q => q.Id == id);
        if(quiz == null){
            return NotFound();
        }
        return _mapper.Map<QuizDTO>(quiz);
    }


}
