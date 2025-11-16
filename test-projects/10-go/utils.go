package main

import "strings"

// FormatName converts a name to uppercase
func FormatName(name string) string {
	return strings.ToUpper(name)
}

// CalculateAge converts years to months
func CalculateAge(years int) int {
	return years * 12
}
