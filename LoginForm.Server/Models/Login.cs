namespace LoginForm.Server.Models
{
    public class Login
    {
        public string EmpId { get; set; }
        public string Password { get; set; }
        public string UserType { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string CreatorId { get; set; }
    }

    public class LoginRequest
    {
        public string EmpId { get; set; }
        public string Password { get; set; }
    }
}
