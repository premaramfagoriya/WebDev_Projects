using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoginForm.Server.Models
{
    [Table("HrSolution")]
    public class HrSolution
    {
        [Key]
        public int Id { get; set; }

        [Column("Emp No")]
        public string EmpNo { get; set; }

        [Column("Name")]
        public string Name { get; set; }

        [Column("Department")]
        public string Department { get; set; }

        [Column("Designation")]
        public string Designation { get; set; }

        [Column("Division")]
        public string Division { get; set; }

        [Column("Building Number")]
        public string BuildingNo { get; set; }

        [Column("Name Of Supervisor")]
        public string Supervisor { get; set; }

        [Column("Grievance Date")]
        public DateTime GrievanceDate { get; set; }

        [Column("Grievance Type")]
        public string GrievanceType { get; set; }

        [Column("Description")]
        public string Description { get; set; }


        public string? Response { get; set; }
        public DateTime? ResponseDate { get; set; }

        //Visibility
        public bool Visibility { get; set; }


    }
}
