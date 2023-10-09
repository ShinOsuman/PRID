using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;

namespace prid_tuto.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly Context _context;
    private readonly IMapper _mapper;

    public UsersController(Context context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
        // Récupère une liste de tous les membres
        return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDTO>> GetOne(int id) { 
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();
        return _mapper.Map<UserDTO>(user);
    }

    // GET: api/Users/byPseudo/{pseudo}
    [HttpGet("byPseudo/{pseudo}")]
    public async Task<ActionResult<UserDTO>> GetByPseudo(string pseudo){
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if(user == null){
            return NotFound();
        }
        return _mapper.Map<UserDTO>(user);
    }

    // GET: api/Users/byEmail/{email}
    [HttpGet("byEmail/{email}")]
    public async Task<ActionResult<UserDTO>> GetByEmail(string email){
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        if(user == null){
            return NotFound();
        }
        return _mapper.Map<UserDTO>(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserDTO>> PostUser(UserWithPasswordDTO user) {
        var newUser = _mapper.Map<User>(user);
        var result = await new UserValidator(_context).ValidateAsync(newUser);
        if(!result.IsValid){
            return BadRequest(result);
        }
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOne), new {id = newUser.Id}, _mapper.Map<UserDTO>(newUser));
    }

    [HttpPut]
    public async Task<IActionResult> PutMember(UserDTO dto) {
        var user = await _context.Users.FindAsync(dto.Id);
        if (user == null)
            return NotFound();
        _mapper.Map<UserDTO, User>(dto, user);
        var result = await new UserValidator(_context).ValidateAsync(user);
        if (!result.IsValid)
            return BadRequest(result);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMember(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

}
