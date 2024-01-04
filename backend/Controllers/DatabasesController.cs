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
public class DatabasesController : ControllerBase
{
    private readonly Context _context;
    private readonly IMapper _mapper;

    public DatabasesController(Context context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [Authorized(Role.Teacher)]
    [HttpGet("getDatabases")]
    public async Task<ActionResult<IEnumerable<DatabaseDto>>> GetDatabases() {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return BadRequest();
        }
        // Récupère une liste de toutes les bases de données
        var databases = await _context.Databases.ToListAsync();
        return _mapper.Map<List<DatabaseDto>>(databases);
    }
    


}
