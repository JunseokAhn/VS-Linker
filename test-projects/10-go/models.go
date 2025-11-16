package main

import "fmt"

// User represents a user model
type User struct {
	Name  string
	Email string
}

// NewUser creates a new User instance
func NewUser(name, email string) *User {
	return &User{
		Name:  name,
		Email: email,
	}
}

// GetInfo returns user information as a string
func (u *User) GetInfo() string {
	return fmt.Sprintf("User: %s, Email: %s", u.Name, u.Email)
}
