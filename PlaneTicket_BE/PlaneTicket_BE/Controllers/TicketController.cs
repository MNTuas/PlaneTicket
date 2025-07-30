using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using PlaneTicket_BE.Models;
using PlaneTicket_BE.Models.Request;
using PlaneTicket_BE.Settings;
using System.Net.Sockets;

namespace PlaneTicket_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly IMongoCollection<Ticket> _ticketCollection;
        private readonly IMongoCollection<Flight> _flightCollection;
        private readonly IOptions<DatabaseSettings> _dbSettings;

        public TicketController(IOptions<DatabaseSettings> dbSettings)
        {
            _dbSettings = dbSettings;
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _ticketCollection = mongoDatabase.GetCollection<Ticket>
                (dbSettings.Value.TicketCollectionName);
            _flightCollection = mongoDatabase.GetCollection<Flight>
                (dbSettings.Value.FlightCollectionName);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await _ticketCollection.Find(_ => true).ToListAsync();
            return Ok(tickets);
        }

        [HttpGet("GetTicketById/{id}")]
        public async Task<IActionResult> GetTicketById(string id)
        {
            var ticketFilter = Builders<Ticket>.Filter.Eq(f => f.Id, id);
            var ticket = await _ticketCollection.Find(ticketFilter).FirstOrDefaultAsync();
            return Ok(ticket);
        }

        [HttpPut("UpdateTicket/{id}")]
        public async Task<IActionResult> UpdateTicket(string id, UpdateTicketRequest request)
        {
            var ticketFilter = Builders<Ticket>.Filter.Eq(t => t.Id, id);
            var ticket = await _ticketCollection.Find(ticketFilter).FirstOrDefaultAsync();
            if (ticket == null || ticket.Status == "Cancelled") return NotFound("Ticket not found or Cancelled");

            var flightFilter = Builders<Flight>.Filter.Eq(f => f.Id, ticket.FlightId);
            var flight = await _flightCollection.Find(flightFilter).FirstOrDefaultAsync();
            if (flight == null) return NotFound("Flight not found");

            var seat = flight.Seats.FirstOrDefault(s => s.SeatNumber == ticket.SeatNumber);
            if (seat == null) return BadRequest("Seat not found");

            // Bước 1: Đánh dấu ghế cũ là chưa đặt
            var unsetOldSeat = Builders<Flight>.Update.Set("Seats.$[elem].IsBooked", false);
            var oldSeatFilter = new List<ArrayFilterDefinition>
            {
                new BsonDocumentArrayFilterDefinition<BsonDocument>(
                new BsonDocument("elem.SeatNumber", ticket.SeatNumber))
            };
            await _flightCollection.UpdateOneAsync(flightFilter, unsetOldSeat, new UpdateOptions { ArrayFilters = oldSeatFilter });

            // Bước 2: Đánh dấu ghế mới là đã đặt
            var setNewSeat = Builders<Flight>.Update.Set("Seats.$[elem].IsBooked", true);
            var newSeatFilter = new List<ArrayFilterDefinition>
            {
                new BsonDocumentArrayFilterDefinition<BsonDocument>(
                new BsonDocument("elem.SeatNumber", request.SeatNumber))
            };
            await _flightCollection.UpdateOneAsync(flightFilter, setNewSeat, new UpdateOptions { ArrayFilters = newSeatFilter });

            // Tính lại tổng giá vé
            var totalPrice = seat.SeatPrice + flight.FlightPrice;


            // Bước 3: Cập nhật thông tin ticket
            var updateTicket = Builders<Ticket>.Update
                .Set(t => t.SeatNumber, request.SeatNumber)
                .Set(t => t.BuyerName, request.BuyerName)
                .Set(t => t.BuyerEmail, request.BuyerEmail)
                .Set(t => t.BuyerPhone, request.BuyerPhone)
                .Set(t => t.TotalPrice, totalPrice)
                .Set(t => t.BookingTime, request.BookingTime);


            await _ticketCollection.UpdateOneAsync(ticketFilter, updateTicket);

            return Ok("Update ticket succesfully");
        }

        [HttpPut("CancelTicket/{id}")]
        public async Task<IActionResult> CancelTicket(string id)
        {
            var ticketFilter = Builders<Ticket>.Filter.Eq(t => t.Id, id);
            var ticket = await _ticketCollection.Find(ticketFilter).FirstOrDefaultAsync();
            if (ticket == null) return NotFound("Ticket not found");

            var flightFilter = Builders<Flight>.Filter.Eq(f => f.Id, ticket.FlightId);
            
            var unsetSeatUpdate = Builders<Flight>.Update.Set("Seats.$[elem].IsBooked", false);
            var arrayFilter = new List<ArrayFilterDefinition>
            {
                new BsonDocumentArrayFilterDefinition<BsonDocument>(
                new BsonDocument("elem.SeatNumber", ticket.SeatNumber))
            };
            await _flightCollection.UpdateOneAsync(flightFilter, unsetSeatUpdate, new UpdateOptions { ArrayFilters = arrayFilter });

            var updateTicket = Builders<Ticket>.Update.Set(t => t.Status, "Cancelled");
            await _ticketCollection.UpdateOneAsync(ticketFilter, updateTicket);

            return Ok("Cancel ticket successfully");
        }


        [HttpPost("BookTicket")]
        public async Task<IActionResult> BookTicket([FromBody] Ticket ticket)
        {
            var flightFilter = Builders<Flight>.Filter.Eq(f => f.Id, ticket.FlightId);
            var flight = await _flightCollection.Find(flightFilter).FirstOrDefaultAsync();
            if (flight == null) return NotFound("Flight not found");

            var seat = flight.Seats.FirstOrDefault(s => s.SeatNumber == ticket.SeatNumber);
            if (seat == null) return BadRequest("Seat not found");
            if (seat.IsBooked) return BadRequest("Seat already booked");

            // Cập nhật ghế là đã đặt
            var update = Builders<Flight>.Update.Set("Seats.$[elem].IsBooked", true);
            var arrayFilters = new List<ArrayFilterDefinition>
            {
                new BsonDocumentArrayFilterDefinition<BsonDocument>(
                new BsonDocument("elem.SeatNumber", ticket.SeatNumber))
            };

            await _flightCollection.UpdateOneAsync(flightFilter, update, new UpdateOptions { ArrayFilters = arrayFilters });

            var totalPrice = seat.SeatPrice + flight.FlightPrice;
            ticket.TotalPrice = totalPrice;

            ticket.Status = "Booked"; 

            // Lưu vé
            await _ticketCollection.InsertOneAsync(ticket);

            return Ok(ticket);
        }

    }
}