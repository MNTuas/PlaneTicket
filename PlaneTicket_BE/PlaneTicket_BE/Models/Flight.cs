using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PlaneTicket_BE.Models
{
    public class Flight
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } 
        public string From { get; set; }
        public string To { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string Airline { get; set; }
        public decimal FlightPrice { get; set; }
        public List<Seat> Seats { get; set; }
    }
    public class Seat
    {
        public string SeatNumber { get; set; } 
        public bool IsBooked { get; set; } 
        public decimal SeatPrice { get; set; }
    }

}
