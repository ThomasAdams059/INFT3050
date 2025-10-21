using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;


namespace PaperTrails_ThomasAdams_c3429938.Models
{
    [Table("BookStats")]
    public class BookStats : ObservableObject
    {
        [PrimaryKey, AutoIncrement]
        public int LocalId { get; set; }

        public int BookId { get; set; }

        public int pagesRead { get; set; }
        public TimeSpan timeSpentReading { get; set; }

        public int readingSessionNum { get; set; }

        public TimeSpan avgReadingTime => readingSessionNum > 0 ? timeSpentReading / readingSessionNum : TimeSpan.Zero;

        public int avgPagesPerSession => readingSessionNum > 0 ? pagesRead / readingSessionNum : 0;
    }
}
