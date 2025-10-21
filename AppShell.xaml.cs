namespace PaperTrails_ThomasAdams_c3429938
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();

            Routing.RegisterRoute("SavedBookDetailsPage", typeof(Pages.SavedBookDetails));
            Routing.RegisterRoute("SavedBookStatsPage", typeof(Pages.SavedBookStats));
            Routing.RegisterRoute("ReadingSession", typeof(Pages.ReadingSession));
            Routing.RegisterRoute("SearchResultsPage", typeof(Pages.SearchResultsPage));
            Routing.RegisterRoute("BookDetailsPage", typeof(Pages.BookDetails));
            
        }
    }
}
