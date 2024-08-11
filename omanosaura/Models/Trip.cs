namespace omanosaura.Models;

public class Trip
{
    public int Id { get; set; }
    public TripKind Kind { get; set; }
    public string TitleEn { get; set; } = string.Empty;
    public string TitleAr { get; set; } = string.Empty;
    public string LocationEn { get; set; } = string.Empty;
    public string LocationAr { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string AboutEn { get; set; } = string.Empty;
    public string AboutAr { get; set; } = string.Empty;
    public string Itinerary { get; set; } = string.Empty;
    public virtual ICollection<StartEndDate>? AvailableDates { get; set; }
    public int PriceBaisa { get; set; } = 0;
}
