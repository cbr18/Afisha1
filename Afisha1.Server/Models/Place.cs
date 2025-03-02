using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Afisha1.Server.Models
{
    [Table("places")]
    public class Place
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("description")]
        public string Description { get; set; } = null!;

        [JsonIgnore]
        public List<Meeting>? Meetings { get; set; }
    }

    public class PlaceDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}