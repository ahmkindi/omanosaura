using System.ComponentModel.DataAnnotations;
namespace omanosaura.Models;

public class StartEndDate
{
    [DataType(DataType.Date)]
    public DateTime StartDate { get; set; }
    [DataType(DataType.Date)]
    public DateTime EndDate { get; set; }
}
