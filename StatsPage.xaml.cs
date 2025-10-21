using PaperTrails_ThomasAdams_c3429938.Models;
using PaperTrails_ThomasAdams_c3429938.Pages;
using PaperTrails_ThomasAdams_c3429938.ViewModels;
using System.Windows.Input;

namespace PaperTrails_ThomasAdams_c3429938.Pages
{
    public partial class StatsPage : ContentPage
    {
        BookViewModel viewModel = BookViewModel.Current;
        public ICommand NavigateToBookStatsCommand { get; }

        public StatsPage()
        {
            InitializeComponent();

            BindingContext = viewModel;

            NavigateToBookStatsCommand = new Command<Book>(async (book) => await NavigateToBookStats(book));

        }

        protected override void OnAppearing()
        {
            viewModel.OnPropertyChanged("Books");
            viewModel.OnPropertyChanged("ReadingBooks");
            viewModel.OnPropertyChanged("WantToReadBooks");
            viewModel.OnPropertyChanged("ReadBooks");

        }

        private async Task NavigateToBookStats(Book tappedBook)
        {
            await Shell.Current.GoToAsync("SavedBookStatsPage", new Dictionary<string, object>
            {
                ["Book"] = tappedBook
            });
        }
    }
}