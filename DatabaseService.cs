using System.Collections.Generic;
using System.Linq;
using System.Text;

using SQLite;
using PaperTrails_ThomasAdams_c3429938.Models;


namespace PaperTrails_ThomasAdams_c3429938.Services
{
    internal static class DatabaseService
    {
        private static string _databaseFile;

        private static string DatabaseFile
        {
            get
            {
                if (_databaseFile == null)
                {
                    string databaseDir = System.IO.Path.Combine(FileSystem.Current.AppDataDirectory, "data");
                    System.IO.Directory.CreateDirectory(databaseDir);

                    _databaseFile = Path.Combine(databaseDir, "book_data.sqlite");
                }
                return _databaseFile;
            }
        }

        private static string _statsDatabaseFile;

        private static string StatsDatabaseFile
        {
            get
            {
                if (_statsDatabaseFile == null)
                {
                    string databaseDir = System.IO.Path.Combine(FileSystem.Current.AppDataDirectory, "data");
                    System.IO.Directory.CreateDirectory(databaseDir);
                    _statsDatabaseFile = Path.Combine(databaseDir, "book_stats.sqlite");
                }
                return _statsDatabaseFile;
            }
        }

        private static SQLiteConnection _connection;

        public static SQLiteConnection Connection
        {
            get
            {
                if (_connection == null)
                { 
                    _connection = new SQLiteConnection(DatabaseFile);
                    _connection.CreateTable<Book>();
                }
                return _connection;
            }
        }

        private static SQLiteConnection _statsConnection;

        public static SQLiteConnection StatsConnection
        {
            get
            {
                if (_statsConnection == null)
                {
                    _statsConnection = new SQLiteConnection(StatsDatabaseFile);
                    _statsConnection.CreateTable<BookStats>();
                }
                return _statsConnection;
            }
        }
    }


}
