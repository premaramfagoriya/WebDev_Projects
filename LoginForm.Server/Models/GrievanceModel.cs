using System.ComponentModel.DataAnnotations.Schema;
using LoginForm.Server.Models;


namespace LoginForm.Server.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Column("Emp No")]
        public string EmpNo { get; set; }

        public string Name { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string Division { get; set; }

        [Column("Building Number")]
        public string BuildingNo { get; set; }

        [Column("Name Of Supervisor")]
        public string Supervisor { get; set; }
    }
}
