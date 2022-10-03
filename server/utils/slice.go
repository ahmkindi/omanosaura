package utils

func Contains(a []string, b string) bool {
	for _, k := range a {
		if b == k {
			return true
		}
	}
	return false
}
