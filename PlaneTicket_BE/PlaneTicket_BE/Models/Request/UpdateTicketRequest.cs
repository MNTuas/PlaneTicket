using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PlaneTicket_BE.Models.Request
{
    public class UpdateTicketRequest
    {
        public string SeatNumber { get; set; }
        public string BuyerName { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerPhone { get; set; }
        public DateTime BookingTime { get; set; }
    }
}
