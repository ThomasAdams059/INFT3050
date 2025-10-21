namespace PaperTrails_ThomasAdams_c3429938.Models;

// Class to hold the entire API response
public class GoogleBooksApiResponse
{
    public string kind { get; set; }
    public int totalItems { get; set; }
    public GoogleBooksApiItem[] items { get; set; }
}

// Class to hold each individual book item
public class GoogleBooksApiItem
{
    public string kind { get; set; }
    public string id { get; set; }
    public string etag { get; set; }
    public string selfLink { get; set; }
    public VolumeInfo volumeInfo { get; set; }
}

// Class to hold the detailed book information
public class VolumeInfo
{
    public string title { get; set; }
    public string[] authors { get; set; }
    public string publisher { get; set; }
    public string publishedDate { get; set; }
    public string description { get; set; }
    public ImageLinks imageLinks { get; set; }
    public string[] categories { get; set; }
    public int pageCount { get; set; }
}

// Class to hold the image URLs
public class ImageLinks
{
    public string smallThumbnail { get; set; }
    public string thumbnail { get; set; }
}