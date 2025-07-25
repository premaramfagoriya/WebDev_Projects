using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using LoginForm.Server.Models;

namespace LoginForm.Server.Library
{
    public class GrievanceDb
    {
        private readonly string _connectionString;

        public GrievanceDb(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Sqlconnection")
                ?? throw new InvalidOperationException("Connection string 'Sqlconnection' not found.");
        }

        // 🔹 Fetch Employee by Emp No
        public Employee? GetEmployeeByEmpNo(string empNo)
        {
            const string query = @"
                SELECT TOP 1 
                    [Emp No], [Name], [Department], [Designation], 
                    [Division], [Building Number], [Name Of Supervisor]
                FROM [dbo].[Employee]
                WHERE [Emp No] = @empNo";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@empNo", empNo);

            conn.Open();
            using var reader = cmd.ExecuteReader();
            if (!reader.Read()) return null;

            return new Employee
            {
                EmpNo = reader["Emp No"]?.ToString(),
                Name = reader["Name"]?.ToString(),
                Department = reader["Department"]?.ToString(),
                Designation = reader["Designation"]?.ToString(),
                Division = reader["Division"]?.ToString(),
                BuildingNo = reader["Building Number"]?.ToString(),
                Supervisor = reader["Name Of Supervisor"]?.ToString()
            };
        }

        // 🔹 Save a new grievance via stored procedure
        public void SaveGrievance(HrSolution grievance)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SaveHrGrievance", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@EmpNo", grievance.EmpNo);
            cmd.Parameters.AddWithValue("@Name", grievance.Name);
            cmd.Parameters.AddWithValue("@Department", grievance.Department);
            cmd.Parameters.AddWithValue("@Designation", grievance.Designation);
            cmd.Parameters.AddWithValue("@Division", grievance.Division);
            cmd.Parameters.AddWithValue("@BuildingNo", grievance.BuildingNo);
            cmd.Parameters.AddWithValue("@Supervisor", grievance.Supervisor);
            cmd.Parameters.AddWithValue("@GrievanceDate", grievance.GrievanceDate);
            cmd.Parameters.AddWithValue("@GrievanceType", grievance.GrievanceType);
            cmd.Parameters.AddWithValue("@Description", grievance.Description);

            conn.Open();
            cmd.ExecuteNonQuery();
        }

        // 🔹 Get grievances by Emp No
        public List<HrSolution> GetGrievancesByEmpNo(string empNo)
        {
            const string query = @"
                SELECT [Id], [Emp No], [Name], [Department], [Designation], [Division],
                       [Building Number], [Name Of Supervisor], [Grievance Date],
                       [Grievance Type], [Description], [Response], [Response Date], [Visibility]
                FROM [dbo].[HrSolution]
                WHERE [Emp No] = @EmpNo
                ORDER BY [Grievance Date] DESC";

            return ExecuteGrievanceQuery(query, new SqlParameter("@EmpNo", empNo));
        }

        // 🔹 Get all grievances (for HR)
        public List<HrSolution> GetAllGrievances()
        {
            const string query = @"
                SELECT [Id], [Emp No], [Name], [Department], [Designation], [Division],
                       [Building Number], [Name Of Supervisor], [Grievance Date],
                       [Grievance Type], [Description], [Response], [Response Date], [Visibility]
                FROM [dbo].[HrSolution]
                ORDER BY [Grievance Date] DESC";

            return ExecuteGrievanceQuery(query);
        }

        // 🔹 Get only grievances marked visible to employees
        public List<HrSolution> GetVisibleGrievances()
        {
            const string query = @"
                SELECT [Id], [Emp No], [Name], [Department], [Designation], [Division],
                       [Building Number], [Name Of Supervisor], [Grievance Date],
                       [Grievance Type], [Description], [Response], [Response Date], [Visibility]
                FROM [dbo].[HrSolution]
                WHERE [Visibility] = 1
                ORDER BY [Grievance Date] DESC";

            return ExecuteGrievanceQuery(query);
        }

        // 🔹 Update response + visibility using SP
        public bool UpdateGrievanceResponseCheckbox(int id, string response, bool visibility)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("UpdateHrGrievanceResponseWithVisibility", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@Response", string.IsNullOrWhiteSpace(response) ? DBNull.Value : response);
            cmd.Parameters.AddWithValue("@Visibility", visibility);

            conn.Open();
            int affectedRows = cmd.ExecuteNonQuery();
            return affectedRows > 0;
        }

        // 🔹 Utility: map query to list of HrSolution objects
        private List<HrSolution> ExecuteGrievanceQuery(string query, params SqlParameter[] parameters)
        {
            var grievances = new List<HrSolution>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(query, conn);
            if (parameters?.Length > 0)
                cmd.Parameters.AddRange(parameters);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                var hasVisibility = Enumerable.Range(0, reader.FieldCount)
                    .Any(i => reader.GetName(i).Equals("Visibility", StringComparison.OrdinalIgnoreCase));

                grievances.Add(new HrSolution
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    EmpNo = reader["Emp No"]?.ToString(),
                    Name = reader["Name"]?.ToString(),
                    Department = reader["Department"]?.ToString(),
                    Designation = reader["Designation"]?.ToString(),
                    Division = reader["Division"]?.ToString(),
                    BuildingNo = reader["Building Number"]?.ToString(),
                    Supervisor = reader["Name Of Supervisor"]?.ToString(),
                    GrievanceDate = Convert.ToDateTime(reader["Grievance Date"]),
                    GrievanceType = reader["Grievance Type"]?.ToString(),
                    Description = reader["Description"]?.ToString(),
                    Response = reader["Response"]?.ToString(),
                    ResponseDate = reader["Response Date"] as DateTime?,
                    Visibility = hasVisibility && reader["Visibility"] != DBNull.Value && Convert.ToBoolean(reader["Visibility"])
                });
            }

            return grievances;
        }
    }
}
