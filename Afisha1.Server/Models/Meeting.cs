using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Afisha1.Server.Models
{
    [Table("meetings")]
    public class Meeting
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("description")]
        public string Description { get; set; } = null!;

        [Column("date")]
        public DateTime Date { get; set; }

        [Column("place_id")]
        public int PlaceId { get; set; }

        [ForeignKey(nameof(PlaceId))]
        [JsonIgnore]
        public Place? Place { get; set; }
    }

    public class MeetingDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Date { get; set; }
        public int PlaceId { get; set; }
    }

    public class MeetingResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Date { get; set; }
        public int PlaceId { get; set; }
        public PlaceDto? Place { get; set; }
    }


}