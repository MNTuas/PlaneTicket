namespace PlaneTicket_BE.Settings
{
    public class DatabaseSettings
    {
        public string? ConnectionString { get; set; }
        public string? DatabaseName { get; set; }
        public string? FlightCollectionName { get; set; }
        public string? TicketCollectionName { get; set; }
    }
}
