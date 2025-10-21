using PaperTrails_ThomasAdams_c3429938.Models;
using PaperTrails_ThomasAdams_c3429938.ViewModels;

namespace PaperTrails_ThomasAdams_c3429938.Pages;

[QueryProperty(nameof(Book), "Book")]
public partial class BookDetails : ContentPage
{
    public Book Book { get; set; }

    public BookDetails()
    {
        InitializeComponent();
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();

        BindingContext = this.Book;
    }

    private async void ReadButton_Clicked(object sender, EventArgs e)
    {
        // Check if the Book object exists first.
        if (this.Book != null)
        {
            bool isAlreadySaved = BookViewModel.Current.Books.Any(b => b.Id == this.Book.Id);

            if (isAlreadySaved)
            {
                await DisplayAlert("Already Saved", "This book is already in your collection.", "OK");
                return;
            }

            this.Book.status = "1"; // Update status to "Want to Read"
            // Save the book to the database.
            BookViewModel.Current.SaveBook(this.Book);

            // Let the user know the book has been saved.
            await DisplayAlert("Success", "Book has been saved", "OK");
        }
        else
        {
            // Optional: Provide feedback if the book object is null.
            await DisplayAlert("Error", "No book data found.", "OK");
        }
    }
}