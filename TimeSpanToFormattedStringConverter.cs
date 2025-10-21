using System;
using System.Globalization;
using Microsoft.Maui.Controls;

namespace PaperTrails_ThomasAdams_c3429938.Converters
{
    public class TimeSpanToFormattedStringConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is TimeSpan timeSpan)
            {
                if (timeSpan.TotalHours >= 24)
                {
                    return $"{(int)timeSpan.TotalDays}d {timeSpan.Hours}hr {timeSpan.Minutes}m";
                }
                else if (timeSpan.TotalMinutes >= 60)
                {
                    return $"{timeSpan.Hours}hr {timeSpan.Minutes}m";
                }
                else
                {
                    return $"{timeSpan.Minutes}m {timeSpan.Seconds}s";
                }
            }
            return string.Empty;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}