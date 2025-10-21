using System.Reflection;
using System.Text.Json;

namespace PaperTrails_ThomasAdams_c3429938.Services;

public static class SecretsReader
{
    private static IDictionary<string, string> secrets;

    public static string GetApiKey()
    {
        if (secrets == null)
        {
            LoadSecrets();
        }

        return secrets["GoogleBooksApiKey"];
    }

    private static void LoadSecrets()
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = "PaperTrails_ThomasAdams_c3429938.Secrets.json";

        using (Stream stream = assembly.GetManifestResourceStream(resourceName))
        using (StreamReader reader = new StreamReader(stream))
        {
            string jsonContent = reader.ReadToEnd();
            secrets = JsonSerializer.Deserialize<IDictionary<string, string>>(jsonContent);
        }
    }
}