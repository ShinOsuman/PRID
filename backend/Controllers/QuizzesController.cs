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
                                    .Where(q => !q.IsTest && q.IsPublished)
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
                                    .Where(q => q.IsTest && q.IsPublished)
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
    public async Task<ActionResult<QuizWithQuestionsAndDatabaseDto>> GetQuiz(int id) {
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
                                    .ThenInclude(q => q.Solutions)
                                    .SingleOrDefaultAsync(q => q.Id == id);
        if(quiz == null){
            return NotFound();
        }
        return _mapper.Map<QuizWithQuestionsAndDatabaseDto>(quiz);
    }

    [Authorized(Role.Teacher)]
    [HttpGet("getByName/{name}")]
    public async Task<ActionResult<QuizWithQuestionsAndDatabaseDto>> GetQuizByName(string name) {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        // Récupère un quiz par son nom
        var quiz = await _context.Quizzes.SingleOrDefaultAsync(q => q.Name == name);
        if(quiz == null){
            return NotFound();
        }
        return _mapper.Map<QuizWithQuestionsAndDatabaseDto>(quiz);
    }

    [Authorized(Role.Teacher)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(int id) {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null)
            return NotFound();
        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorized(Role.Teacher)]
    [HttpPost]
    public async Task<ActionResult<QuizDTO>> SaveQuiz(QuizWithQuestionsAndDatabaseDto quizDto) {
        var quiz = _mapper.Map<Quiz>(quizDto);
        var result = await new QuizValidator(_context).ValidateAsync(quiz);
        if(!result.IsValid){
            return BadRequest(result);
        }
        _context.Quizzes.Add(quiz);
        _context.Entry(quiz.Database).State = EntityState.Unchanged;
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetQuiz), new {id = quiz.Id}, _mapper.Map<QuizWithQuestionsAndDatabaseDto>(quiz));
    }

    [Authorized(Role.Teacher)]
    [HttpPut]
    public async Task<IActionResult> UpdateQuiz(QuizWithQuestionsAndDatabaseDto quizDto) {
        var quiz = await _context.Quizzes.Where(q => q.Id == quizDto.Id)
                                    .Include(q => q.Database)
                                    .Include(q => q.Attempts)
                                    .Include(q => q.Questions)
                                    .ThenInclude(q => q.Solutions)
                                    .SingleOrDefaultAsync();
        if (quiz == null)
            return NotFound();
        _mapper.Map(quizDto, quiz);
        var result = await new QuizValidator(_context).ValidateAsync(quiz);
        if(!result.IsValid){
            return BadRequest(result);
        }
        await _context.SaveChangesAsync();
        return NoContent();
    }


}
