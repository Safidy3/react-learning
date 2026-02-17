import requests
import argparse
import json

URL = 'http://localhost:5001/'

def test_api(method, endpoint, data=None):
	"""
	Test an API by sending the specified HTTP method and endpoint.
	
	:param method: HTTP method (GET, POST, PUT, DELETE)
	:param endpoint: API endpoint (URL)
	:param data: Payload for POST/PUT requests (default is None)
	"""
	# Ensure the method is in uppercase
	method = method.upper()

	try:
		# Send the HTTP request based on the method
		if method == "GET":
			response = requests.get(URL + endpoint)
		elif method == "POST":
			response = requests.post(URL + endpoint, json=data)
		elif method == "PUT":
			response = requests.put(URL + endpoint, json=data)
		elif method == "DELETE":
			response = requests.delete(URL + endpoint)
		else:
			print(f"Invalid HTTP method: {method}")
			return

		# Check if the request was successful
		if response.status_code == 200:
			print(f"Response (Status code: {response.status_code}):")
			# Parse the JSON string into a Python object
			parsed_object = response.json()
			pretty_json_string = json.dumps(parsed_object, indent=4)
			print(pretty_json_string)
		else:
			print(f"Request failed. Status code: {response.status_code}")
			print(response.text)

	except requests.exceptions.RequestException as e:
		print(f"An error occurred: {e}")

def parse_arguments():
	"""
	Parse command-line arguments for method, endpoint, and data.
	"""
	parser = argparse.ArgumentParser(description="Test API with various HTTP methods.")
	parser.add_argument("method", choices=["GET", "POST", "PUT", "DELETE"], help="HTTP method to use")
	parser.add_argument("endpoint", help="API endpoint (URL)")
	parser.add_argument("--data", help="Data for POST/PUT requests (JSON format)", type=str)

	return parser.parse_args()

if __name__ == "__main__":
	args = parse_arguments()

	# If the method is POST or PUT, and data is provided, convert the data to a dictionary
	data = None
	if args.data:
		try:
			data = json.loads(args.data)  # Convert string to JSON
		except json.JSONDecodeError:
			print("Invalid JSON data provided for the POST/PUT request.")
			exit(1)
	test_api(args.method, args.endpoint, data)

# curl -X POST http://localhost:5001/ -H “Authorization: Bearer TOKEN” -d ‘{“name”:“foo”,“value”:42}’

# Todo token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyN2EyNDJhLTdiOTctNGIxZS04ODU0LTMzNWQ3MjEwYjJkNCIsImlhdCI6MTc3MTI1NDc0MywiZXhwIjoxNzcxODU5NTQzfQ.1oa2dNmE_aLbcO6887kKxaf_Af2oZxcZjk7qGc6IuLc