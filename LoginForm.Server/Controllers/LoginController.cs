using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using LoginForm.Server.Models;

namespace LoginForm.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult Post([FromBody] LoginRequest request)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                //  Fetch EmpId, UserType, and Name from the Login table
                string sql = "SELECT EmpId, UserType, Name FROM Login WHERE EmpId = @EmpId AND Password = @Password";

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@EmpId", request.EmpId);
                    cmd.Parameters.AddWithValue("@Password", request.Password);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            //  Read and return all needed fields
                            var result = new
                            {
                                EmpId = reader["EmpId"].ToString(),
                                UserType = reader["UserType"].ToString(),
                                Name = reader["Name"].ToString()
                            };

                            // (Optional) Debug log to console
                            Console.WriteLine($"Login success: {result.EmpId}, {result.Name}, {result.UserType}");


                            return Ok(result);
                        }
                        else
                        {
                            return Unauthorized(new { message = "Invalid credentials" });
                        }
                    }
                }
            }
        }

    }
}
