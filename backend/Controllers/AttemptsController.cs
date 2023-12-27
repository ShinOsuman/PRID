using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;
using Microsoft.AspNetCore.Authorization;
using Google.Protobuf.WellKnownTypes;

namespace prid.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AttemptsController : ControllerBase
{
    private readonly Context _context;
    private readonly IMapper _mapper;

    public AttemptsController(Context context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }


    [Authorize]
    [HttpPost("getlastattempt")]
    public async Task<ActionResult<AttemptDto>> GetLastAttempt(QuizWithIdDto quizDTO){
        //récupération de l'utilisateur
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        //récupération du quiz
        var quiz = await _context.Quizzes.Where(q => q.Id == quizDTO.Id)
                                        .Include(q => q.Attempts).SingleOrDefaultAsync();
        if(quiz == null){
            return BadRequest();
        }
        //récupération de l'attempt
        var attempt = await _context.Attempts.Where(a => a.StudentId == user.Id && quiz.Id == a.QuizId).OrderBy(a => a.Id).LastOrDefaultAsync();

        return _mapper.Map<AttemptDto>(attempt);
    }

    [Authorize]
    [HttpPost("close")]
    public async Task<IActionResult> Cloture(QuizWithIdDto quizDTO){
        //récupération de l'utilisateur
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        //récupération du quiz
        var quiz = await _context.Quizzes.Where(q => q.Id == quizDTO.Id)
                                        .Include(q => q.Attempts).SingleOrDefaultAsync();
        if(quiz == null){

            return BadRequest();
        }

        //récupération de la dernière tentative
        var attempt = quiz.Attempts.LastOrDefault(a => a.StudentId == user.Id);
        if(attempt == null){
            return BadRequest();
        }
        //cloture de la tentative
        attempt.Finish = DateTime.Now;

        var answers = await _context.Answers
                            .Where(a => a.AttemptId == attempt.Id)
                            .ToListAsync();
        var questions = await _context.Questions
                            .Where(q => q.QuizId == quiz.Id)
                            .ToListAsync();
        foreach(var q in questions){
            var answer = answers.FirstOrDefault(a => a.QuestionId == q.Id);
            if(answer == null){
                answer = new Answer { AttemptId = attempt.Id, QuestionId = q.Id, Sql = "", IsCorrect = false, Timestamp = DateTime.Now };
                _context.Answers.Add(answer);
            }
        }

        _context.SaveChanges();

        return Ok();
    }
    
}