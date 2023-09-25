using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;

namespace prid_tuto.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly Context _context;

    public UsersController(Context context) {
        _context = context;
    }

    // GET: api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll() {
        // Récupère une liste de tous les membres
        return await _context.Users.ToListAsync();
    }

}
