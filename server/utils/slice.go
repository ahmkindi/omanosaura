package utils

import "github.com/FusionAuth/go-client/pkg/fusionauth"

func Contains(a []string, b string) bool {
	for _, k := range a {
		if b == k {
			return true
		}
	}
	return false
}

func GetRoles(a []fusionauth.UserRegistration, b string) []string {
	for _, k := range a {
		if b == k.ApplicationId {
			return k.Roles
		}
	}
	return nil
}
