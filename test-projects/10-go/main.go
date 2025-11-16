package main

import "fmt"

// Go의 import는 package를 위한 것이므로
// 파일 참조는 주석으로 표시합니다
// @file: ./utils.go
// @file: ./models.go

func main() {
	fmt.Println("VS-Linker Go Test")

	// Utils 함수 사용
	formatted := FormatName("홍길동")
	fmt.Printf("Formatted name: %s\n", formatted)

	// User 모델 사용
	user := NewUser("홍길동", "hong@example.com")
	fmt.Println(user.GetInfo())

	age := CalculateAge(30)
	fmt.Printf("Age in months: %d\n", age)
}
