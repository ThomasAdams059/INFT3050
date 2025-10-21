using PaperTrails_ThomasAdams_c3429938.ViewModels;

namespace PaperTrails_ThomasAdams_c3429938
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            BookViewModel.Current = new BookViewModel();
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            return new Window(new AppShell());
        }
    }
}