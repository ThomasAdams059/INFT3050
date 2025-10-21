using System.Windows.Input;
using PaperTrails_ThomasAdams_c3429938.Models;
using PaperTrails_ThomasAdams_c3429938.Pages;
using PaperTrails_ThomasAdams_c3429938.ViewModels;

namespace PaperTrails_ThomasAdams_c3429938
{
    public partial class MainPage : ContentPage
    {

        BookViewModel viewModel;
        public ICommand NavigateToSavedBookDetailsCommand { get; }
        
        public MainPage()
        {
            InitializeComponent();

            BindingContext = viewModel = new BookViewModel();

            NavigateToSavedBookDetailsCommand = new Command<Book>(async (book) => await NavigateToSavedBookDetails(book));
            
        }

        protected override void OnAppearing()
        {
            viewModel.OnPropertyChanged("Books");
            viewModel.OnPropertyChanged("ReadingBooks");
            viewModel.OnPropertyChanged("WantToReadBooks");
            viewModel.OnPropertyChanged("ReadBooks");

        }

        private async Task NavigateToSavedBookDetails(Book tappedBook)
        {
            await Shell.Current.GoToAsync("SavedBookDetailsPage", new Dictionary<string, object>
            {
                ["Book"] = tappedBook
            });
        }

    }
}