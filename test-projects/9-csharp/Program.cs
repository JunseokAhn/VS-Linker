using System;

namespace VSLinkerTest
{
    // C#의 using은 namespace를 위한 것이므로
    // 파일 참조는 주석으로 표시합니다
    // @file: ./Utils.cs
    // @file: ./Models.cs

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("VS-Linker C# Test");

            // Utils 클래스 사용
            string formattedText = Utils.FormatText("hello world");
            Console.WriteLine("Formatted: " + formattedText);

            // User 모델 사용
            var user = new User("홍길동", "hong@example.com");
            Console.WriteLine(user.GetInfo());
        }
    }
}
