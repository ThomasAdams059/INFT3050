namespace PaperTrails_ThomasAdams_c3429938.Pages;

using PaperTrails_ThomasAdams_c3429938.Models;
using PaperTrails_ThomasAdams_c3429938.ViewModels;
// SearchResultsPage.xaml.cs
using System.Collections.ObjectModel;
using System.Windows.Input;

public partial class SearchResultsPage : ContentPage
{

    public ICommand NavigateToBookDetailsCommand { get; }

    public SearchResultsPage()
    {
        InitializeComponent();

        BindingContext = BookViewModel.Current;

        NavigateToBookDetailsCommand = new Command<Book>(async (book) => await NavigateToBookDetails(book));
    }

    private async Task NavigateToBookDetails(Book tappedBook)
    {
        await Shell.Current.GoToAsync("BookDetailsPage", new Dictionary<string, object>
        {
            ["Book"] = tappedBook
        });
    }
}