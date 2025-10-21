using Microsoft.Maui.Devices.Sensors;

namespace PaperTrails_ThomasAdams_c3429938.Models
{
    public class ReadingLocationPin
    {
        // The core location data
        public Location Location { get; set; }

        // The title that appears on the pin marker
        public string Label { get; set; }

        // The descriptive text that appears below the label
        public string Address { get; set; }
    }
}