using Microsoft.AspNetCore.Mvc;
using LoginForm.Server.Library;
using LoginForm.Server.Models;

namespace LoginForm.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrievanceController : ControllerBase
    {
        private readonly GrievanceDb _db;

        public GrievanceController(GrievanceDb db)
        {
            _db = db;
        }

        // 🔹 GET: api/grievance/employee?empNo=E123
        [HttpGet("employee")]
        public IActionResult GetEmployeeDetails([FromQuery] string empNo)
        {
            if (string.IsNullOrWhiteSpace(empNo))
                return BadRequest("Employee number is required");

            var employee = _db.GetEmployeeByEmpNo(empNo);
            if (employee == null)
                return NotFound("Employee not found");

            return Ok(employee);
        }

        // 🔹 POST: api/grievance
        [HttpPost]
        public IActionResult SubmitGrievance([FromBody] HrSolution grievance)
        {
            if (grievance == null)
                return BadRequest("Invalid grievance data");

            try
            {
                _db.SaveGrievance(grievance);
                return Ok("Grievance submitted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // 🔹 GET: api/grievance/requests?empNo=E123
        [HttpGet("requests")]
        public IActionResult GetEmployeeGrievances([FromQuery] string empNo)
        {
            if (string.IsNullOrWhiteSpace(empNo))
                return BadRequest("Employee number is required");

            var grievances = _db.GetGrievancesByEmpNo(empNo);
            return Ok(grievances);
        }

        // 🔹 GET: api/grievance/all (HR view)
        [HttpGet("all")]
        public IActionResult GetAllGrievances()
        {
            try
            {
                var all = _db.GetAllGrievances();
                return Ok(all);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to retrieve data: {ex.Message}");
            }
        }

        // 🔹 PUT: api/grievance/{id} (Update response + visibility)
        [HttpPut("{id}")]
        public IActionResult UpdateGrievanceResponse(int id, [FromBody] HrSolution updated)
        {
            if (updated == null)
                return BadRequest("Invalid update data");

            bool result = _db.UpdateGrievanceResponseCheckbox(
                id,
                updated.Response ?? "",
                updated.Visibility
            );

            if (!result)
                return NotFound("Grievance not found or update failed");

            return Ok("Grievance response/visibility updated successfully");
        }

    }
}
