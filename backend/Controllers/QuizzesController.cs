using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using prid.Helpers;

namespace prid_tuto.Controllers;

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
    public async Task<ActionResult<IEnumerable<QuizDTO>>> GetAll() {
        // Récupère une liste de tous les membres
        return _mapper.Map<List<QuizDTO>>(await _context.Quizzes.Where(q => !q.IsTest).ToListAsync());
    }


}
