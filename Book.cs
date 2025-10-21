using SQLite;

namespace PaperTrails_ThomasAdams_c3429938.Models;

[Table("books")]

public class Book : ObservableObject
{


    // Property for local database ID
    [PrimaryKey, AutoIncrement]
    public int LocalId { get; set; }

    public string Id { get; set; }

    [MaxLength(260)]
    public string title { get; set; }
    public string authors { get; set; }
    public string categories { get; set; }
    public string publisher { get; set; }
    public string publishedDate { get; set; }
    public string description { get; set; }
    public int pageCount { get; set; }

    public string status { get; set; } // 0 = N/A (Not yet interacted with, default value), 1 = Want To Read, 2 = Reading, 3 = Read
}