using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController:BaseApiController
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound(){
             return NotFound();
        }
        [HttpGet("unauthorized")]
        public ActionResult GetUnauthorized(){
             return Unauthorized();
        }
        [HttpGet("bad-request")]
        public ActionResult GetBadRequest(){
             return BadRequest(new ProblemDetails{
                Title="This is bad request"
             });
        }
        [HttpGet("validation-error")]
        public ActionResult GetValidationError(){
            ModelState.AddModelError("Problem 1","This is first problem");
            ModelState.AddModelError("Problem 2","This is second problem");
             return ValidationProblem();
        }
        [HttpGet("server-error")]
        public ActionResult GetServerError(){
             throw new Exception("This is a server error");
        }
    }
}