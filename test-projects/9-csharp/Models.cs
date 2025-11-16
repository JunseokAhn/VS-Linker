using System;

namespace VSLinkerTest
{
    public class User
    {
        public string Name { get; set; }
        public string Email { get; set; }

        public User(string name, string email)
        {
            Name = name;
            Email = email;
        }

        public string GetInfo()
        {
            return $"User: {Name}, Email: {Email}";
        }
    }
}
