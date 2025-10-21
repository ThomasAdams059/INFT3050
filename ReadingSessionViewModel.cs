using PaperTrails_ThomasAdams_c3429938.Models;
using PaperTrails_ThomasAdams_c3429938.Services;
using System.ComponentModel;
using System.Windows.Input;
using Microsoft.Maui.Devices.Sensors;

namespace PaperTrails_ThomasAdams_c3429938.ViewModels
{
    public class ReadingSessionViewModel : ObservableObject
    {
        private DateTime _sessionStartTime;
        private int _pagesRead;

        public Book CurrentBook { get; set; }

        public int PagesRead
        {
            get => _pagesRead;
            set
            {
                if (_pagesRead != value)
                {
                    _pagesRead = value;
                    OnPropertyChanged();
                }
            }
        }

        public ICommand FinishSessionCommand { get; }

        public ReadingSessionViewModel(Book book)
        {
            CurrentBook = book;
            _sessionStartTime = DateTime.Now;
            FinishSessionCommand = new Command(FinishSession);
        }

        private async void FinishSession()
        {
            if (PagesRead > CurrentBook.pageCount)
            {
                await Application.Current.MainPage.DisplayAlert("Invalid Page Number", $"The number of pages read cannot exceed the total page count of {CurrentBook.pageCount}.", "OK");
                return; // Exit the method and do not save the session
            }

            try
            {
                // 1. Get current location (using a medium accuracy request with a timeout)
                var location = await Geolocation.GetLocationAsync(
                    new GeolocationRequest(GeolocationAccuracy.Medium, TimeSpan.FromSeconds(10)));

                if (location != null)
                {
                    // 2. Create and populate the new ReadingLocation model
                    var readingLocation = new ReadingLocation
                    {
                        BookLocalId = CurrentBook.LocalId,
                        Latitude = location.Latitude,
                        Longitude = location.Longitude,
                        TimeStamp = DateTime.Now,
                        Description = $"Session {BookViewModel.Current.GetBookStats(CurrentBook.LocalId)?.readingSessionNum + 1 ?? 1} End"
                    };

                    // 3. Save the location using the ViewModel
                    BookViewModel.Current.SaveReadingLocation(readingLocation);
                }
                // NOTE: We continue the session save even if location is null (e.g., if permissions failed)
            }
            catch (Exception ex)
            {
                // Catch all other exceptions (timeouts, etc.)
                System.Diagnostics.Debug.WriteLine($"Error getting location: {ex.Message}");
            }

            TimeSpan timeSpent = DateTime.Now - _sessionStartTime;

            BookStats existingStats = BookViewModel.Current.GetBookStats(CurrentBook.LocalId);

            if (existingStats == null)
            {
                CurrentBook.status = "2"; // Ensure status is set to "Reading" if not already

                var newStats = new BookStats
                {
                    BookId = CurrentBook.LocalId,
                    pagesRead = PagesRead,
                    timeSpentReading = timeSpent,
                    readingSessionNum = 1
                };

                BookViewModel.Current.SaveBookStats(newStats);
            }
            else
            {
                // If stats exist, update the record
                existingStats.pagesRead = PagesRead;
                existingStats.timeSpentReading += timeSpent;
                existingStats.readingSessionNum += 1;
                BookViewModel.Current.SaveBookStats(existingStats);
            }

            // Save the updated book

            if (PagesRead == CurrentBook.pageCount)
            {
                CurrentBook.status = "3"; // Mark as Read
            }

            BookViewModel.Current.SaveBook(CurrentBook);

            await Application.Current.MainPage.DisplayAlert("Session Saved", "Your reading session has been saved.", "OK");
            await Shell.Current.GoToAsync(".."); // Navigate back
        }
    }
}