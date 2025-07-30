using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PlaneTicket_BE.Models
{
    public class Ticket
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } 
        public string FlightId { get; set; }
        public string SeatNumber { get; set; }
        public string BuyerName { get; set; } 
        public string BuyerEmail { get; set; }
        public string BuyerPhone { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime BookingTime { get; set; }
        public string Status { get; set; }
    }
}
