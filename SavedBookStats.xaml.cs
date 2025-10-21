using Microsoft.Maui.Controls.Maps;
using Microsoft.Maui.Devices.Sensors; // For Location
using Microsoft.Maui.Maps;
using PaperTrails_ThomasAdams_c3429938.Models;
using PaperTrails_ThomasAdams_c3429938.ViewModels;
using System.Collections.ObjectModel;
using Map = Microsoft.Maui.Controls.Maps.Map;

namespace PaperTrails_ThomasAdams_c3429938.Pages;

[QueryProperty(nameof(Book), "Book")]
public partial class SavedBookStats : ContentPage
{
    public Book Book { get; set; }
    public BookStats BookStats { get; set; }

    // 1. ADD: Collection to hold the pins for map binding
    public ObservableCollection<ReadingLocationPin> ReadingLocationPins { get; set; } = new ObservableCollection<ReadingLocationPin>();

    public SavedBookStats()
	{
		InitializeComponent();
                
	}

    protected override void OnAppearing()
    {
        base.OnAppearing();

        this.BookStats = BookViewModel.Current.GetBookStats(this.Book.LocalId);

        BindingContext = this;

        // 2. LOAD: Load reading locations and display the pins
        LoadPins();
    }

    private void LoadPins()
    {
        ReadingLocationPins.Clear();

        if (this.Book == null || this.Book.LocalId == 0)
            return;

        // Fetch raw location data from the database
        var rawLocations = BookViewModel.Current.GetReadingLocations(this.Book.LocalId);

        if (rawLocations.Any())
        {
            // Convert raw data (ReadingLocation) into bindable Pin models
            foreach (var loc in rawLocations)
            {
                var pin = new ReadingLocationPin
                {
                    Location = new Location(loc.Latitude, loc.Longitude),
                    // Use the saved description (e.g., "Session 1 End") and timestamp for the address
                    Label = $"Read Session",
                    Address = $"{loc.Description} - {loc.TimeStamp:f}"
                };
                ReadingLocationPins.Add(pin);
            }

            // Center the map on the first recorded location
            var firstLocation = ReadingLocationPins.First().Location;
            // Assuming you named your map control 'mapLocations' in XAML (from step 2)
            mapLocations.MoveToRegion(MapSpan.FromCenterAndRadius(firstLocation, Distance.FromKilometers(10)));
        }
    }
}