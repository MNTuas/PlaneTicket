using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using PlaneTicket_BE.Models;
using PlaneTicket_BE.Settings;

namespace PlaneTicket_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        private readonly IMongoCollection<Ticket> _ticketCollection;
        private readonly IMongoCollection<Flight> _flightCollection;
        private readonly IOptions<DatabaseSettings> _dbSettings;

        public FlightController(IOptions<DatabaseSettings> dbSettings)
        {
            _dbSettings = dbSettings;
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _flightCollection = mongoDatabase.GetCollection<Flight>
                (dbSettings.Value.FlightCollectionName);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFlight()
        {
            var flights = await _flightCollection.Find(_ => true).ToListAsync();
            return Ok(flights);
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetFlightsByFilter(
            [FromQuery] string from,
            [FromQuery] string to,
            [FromQuery] DateTime? departureDateFrom,
            [FromQuery] DateTime? departureDateTo)
        {
            var filterBuilder = Builders<Flight>.Filter;
            var filter = filterBuilder.Empty;

            if (!string.IsNullOrEmpty(from))
                filter &= filterBuilder.Eq(f => f.From, from);

            if (!string.IsNullOrEmpty(to))
                filter &= filterBuilder.Eq(f => f.To, to);

            if (departureDateFrom.HasValue)
                filter &= filterBuilder.Gte(f => f.DepartureTime, departureDateFrom.Value.Date);

            if (departureDateTo.HasValue)
                filter &= filterBuilder.Lte(f => f.DepartureTime, departureDateTo.Value.Date.AddDays(1).AddTicks(-1));
            // lấy đến hết ngày to

            var flights = await _flightCollection.Find(filter).ToListAsync();

            return Ok(flights);
        }

        [HttpGet("GetFlightById/{id}")]
        public async Task<IActionResult> GetFlightById(string id)
        {
            var flightFilter = Builders<Flight>.Filter.Eq(f => f.Id, id);
            var flight = await _flightCollection.Find(flightFilter).FirstOrDefaultAsync();
            return Ok(flight);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFlight([FromBody] Flight flight)
        {
            await _flightCollection.InsertOneAsync(flight);
            return Ok(flight);
        }

    }
}