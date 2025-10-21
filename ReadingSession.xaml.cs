using PaperTrails_ThomasAdams_c3429938.Models;
using PaperTrails_ThomasAdams_c3429938.ViewModels;

namespace PaperTrails_ThomasAdams_c3429938.Pages;

[QueryProperty(nameof(Book), "Book")]
public partial class ReadingSession : ContentPage
{
	public Book Book { get; set; }
	public ReadingSession()
	{
		InitializeComponent();
	}
	protected override void OnAppearing()
	{
		base.OnAppearing();
		BindingContext = new ReadingSessionViewModel(Book);
    }
}
	